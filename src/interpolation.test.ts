import { describe, expect, test } from "bun:test";
import { interpolateStrings, interpolateWaypoints, isColor, numAttr, rangeT } from "./waypoints";

describe("interpolateStrings", () => {
  test("interpolates single numeric value", () => {
    expect(
      interpolateStrings("translateY(0px)", "translateY(100px)", 0.5)
    ).toBe("translateY(50px)");
  });

  test("interpolates multiple numeric values", () => {
    expect(
      interpolateStrings("translate(0px, 0px)", "translate(100px, 200px)", 0.25)
    ).toBe("translate(25px, 50px)");
  });

  test("returns start value at t=0", () => {
    expect(interpolateStrings("scale(1)", "scale(2)", 0)).toBe("scale(1)");
  });

  test("returns end value at t=1", () => {
    expect(interpolateStrings("scale(1)", "scale(2)", 1)).toBe("scale(2)");
  });

  test("handles negative numbers", () => {
    expect(interpolateStrings("rotate(-90deg)", "rotate(90deg)", 0.5)).toBe(
      "rotate(0deg)"
    );
  });

  test("handles decimal values", () => {
    expect(interpolateStrings("opacity: 0.2", "opacity: 0.8", 0.5)).toBe(
      "opacity: 0.5"
    );
  });

  test("generates color-mix for color values", () => {
    const result = interpolateStrings("#000", "#fff", 0.3);
    expect(result).toContain("color-mix");
    expect(result).toContain("#000");
    expect(result).toContain("#fff");
    expect(result).toContain("70%");
  });

  test("generates color-mix for named colors", () => {
    const result = interpolateStrings("red", "blue", 0.5);
    expect(result).toContain("color-mix");
  });

  test("snaps non-numeric non-color strings at midpoint", () => {
    expect(interpolateStrings("block", "none", 0.3)).toBe("block");
    expect(interpolateStrings("block", "none", 0.7)).toBe("none");
  });

  /*
  Hex colors are digit-bearing strings, so a numeric-first kernel eats them: the
  digit runs in `#290000` interpolate as one decimal number and the letters are
  carried through verbatim. Every case below produced garbage before the color
  test was hoisted above the numeric branch.
  */
  test("interpolates all-hex-digit colors as colors, not decimals", () => {
    // 0x29 -> 0x31 midpoint is 0x2d; a decimal read of "290000"->"310000" gives "#300000".
    const result = interpolateStrings("#290000", "#310000", 0.5);
    expect(result).toContain("color-mix");
    expect(result).toContain("#290000");
    expect(result).toContain("#310000");
  });

  test("does not freeze colors whose digit runs are all zero", () => {
    // "#a0b0c0" and "#d0e0f0" both scan as 0,0,0 — every t interpolated 0->0,
    // so the value never left the start color.
    const mid = interpolateStrings("#a0b0c0", "#d0e0f0", 0.5);
    const late = interpolateStrings("#a0b0c0", "#d0e0f0", 0.9);
    expect(mid).toContain("color-mix");
    expect(mid).not.toBe("#a0b0c0");
    expect(late).not.toBe(mid);
  });

  test("never emits a fractional hex literal", () => {
    // "#100000"->"#100001" @0.5 produced "#100000.5": invalid CSS, so the
    // declaration is dropped and the element flashes to its unstyled value.
    const result = interpolateStrings("#100000", "#100001", 0.5);
    expect(result).not.toMatch(/#[0-9a-fA-F]*\./);
    expect(result).toContain("color-mix");
  });

  test("strips trailing zeros from decimals", () => {
    expect(interpolateStrings("x(0px)", "x(1px)", 0.5)).toBe("x(0.5px)");
    expect(interpolateStrings("x(0px)", "x(3px)", 1 / 3)).toMatch(/x\(1px\)/);
  });
});

describe("interpolateWaypoints", () => {
  const waypoints = [
    { progress: 0, x: 0, y: 10 },
    { progress: 0.5, x: 100, y: 20 },
    { progress: 1, x: 200, y: 30 },
  ];

  test("returns null for empty array", () => {
    expect(interpolateWaypoints(0.5, [])).toBeNull();
  });

  test("returns null for null/undefined", () => {
    expect(interpolateWaypoints(0.5, null as any)).toBeNull();
  });

  test("clamps to first waypoint before range", () => {
    const result = interpolateWaypoints(-0.5, waypoints);
    expect(result.x).toBe(0);
    expect(result.y).toBe(10);
  });

  test("clamps to last waypoint after range", () => {
    const result = interpolateWaypoints(1.5, waypoints);
    expect(result.x).toBe(200);
    expect(result.y).toBe(30);
  });

  test("returns exact waypoint values at waypoint progress", () => {
    const result = interpolateWaypoints(0, waypoints);
    expect(result.x).toBe(0);
    expect(result.y).toBe(10);
  });

  test("interpolates between waypoints with easing", () => {
    const result = interpolateWaypoints(0.25, waypoints);
    // easeInOutQuad at t=0.5 (midpoint of 0-0.5 range) = 0.5
    expect(result.x).toBe(50);
    expect(result.y).toBe(15);
  });

  test("handles single waypoint", () => {
    const result = interpolateWaypoints(0.5, [{ progress: 0, x: 42 }]);
    expect(result.x).toBe(42);
  });

  test("sorts unsorted waypoints", () => {
    const unsorted = [
      { progress: 1, x: 200 },
      { progress: 0, x: 0 },
      { progress: 0.5, x: 100 },
    ];
    const result = interpolateWaypoints(0, unsorted);
    expect(result.x).toBe(0);
  });
});

describe("rangeT", () => {
  test("maps a position onto its span", () => {
    expect(rangeT(0.25, 0, 0.5)).toBe(0.5);
    expect(rangeT(0.5, 0.5, 1)).toBe(0);
    expect(rangeT(1, 0.5, 1)).toBe(1);
  });

  /*
  Two waypoints may share a `progress` — a deliberate step change, or an authoring slip.
  The raw division is 0/0, and the NaN it returns propagates into every style the pair
  drives: the animator freezes with no error anywhere.
  */
  test("a zero-width span resolves to its far end, not NaN", () => {
    expect(rangeT(0.5, 0.5, 0.5)).toBe(1);
    expect(Number.isNaN(rangeT(0.5, 0.5, 0.5))).toBe(false);
  });
});

describe("numAttr", () => {
  /*
  This is the test 0.7.0 shipped without, and it is why a regression got in.
  `Number(attr) || fallback` swallows an explicit 0; the repair that replaced it,
  `Number.isFinite(Number(attr)) ? … : fallback`, swallows the fallback instead —
  `Number(null)` is 0 and 0 is finite, so `<tosi-product-header>` with no
  `threshold` resolved to 0 and slid in at the first pixel of scroll. Both
  directions are asserted here, because fixing one by breaking the other is
  exactly what happened.
  */
  test("an absent attribute takes the fallback", () => {
    expect(numAttr(null, 50)).toBe(50);
  });

  test("an empty attribute takes the fallback", () => {
    expect(numAttr("", 50)).toBe(50);
    expect(numAttr("   ", 50)).toBe(50);
  });

  test("an explicit zero is a value, not a missing attribute", () => {
    expect(numAttr("0", 50)).toBe(0);
    expect(numAttr("0", 24)).toBe(0);
  });

  test("an unparseable attribute takes the fallback", () => {
    expect(numAttr("banana", 50)).toBe(50);
    expect(numAttr("NaN", 50)).toBe(50);
    expect(numAttr("Infinity", 50)).toBe(50);
  });

  test("ordinary values pass through, negatives included", () => {
    expect(numAttr("120", 50)).toBe(120);
    expect(numAttr("-3.5", 0)).toBe(-3.5);
  });
});

describe("interpolateStrings on rgb()/hsl()", () => {
  /*
  Unifying the kernel hoisted the color test above the numeric branch, so these
  now blend as colors rather than per-channel numbers. That is the correct and
  consistent behaviour — per-channel hsl interpolation takes the long way round
  the hue wheel — but it is a behaviour CHANGE, and it went out undocumented in
  the first cut of 0.7.0. Pinned here so it cannot drift back silently.
  */
  test("rgb() blends through color-mix", () => {
    const r = interpolateStrings("rgb(0,0,0)", "rgb(255,255,255)", 0.5);
    expect(r).toBe("color-mix(in srgb, rgb(0,0,0) 50%, rgb(255,255,255))");
  });

  test("hsl() blends through color-mix", () => {
    const r = interpolateStrings("hsl(0,0%,0%)", "hsl(200,50%,50%)", 0.25);
    expect(r).toContain("color-mix(in srgb, hsl(0,0%,0%) 75%");
  });

  test("endpoints are returned verbatim, so t=0/1 need no color-mix support", () => {
    expect(interpolateStrings("rgb(0,0,0)", "rgb(255,255,255)", 0)).toBe("rgb(0,0,0)");
    expect(interpolateStrings("rgb(0,0,0)", "rgb(255,255,255)", 1)).toBe("rgb(255,255,255)");
  });
});

describe("isColor matches whole values only", () => {
  /*
  A prefix test (`startsWith("rgb")`) also matches every shorthand that BEGINS with a
  color and keeps going. Wrapping one of those in color-mix() yields
  `color-mix(in srgb, rgb(0,0,0) 0 0 10px 50%, …)` — not a color and not valid CSS, so
  the browser drops the declaration and the shadow disappears for the whole pin interior,
  reappearing at t=0 and t=1 where the early-outs return the raw values.
  */
  for (const v of [
    "#fff", "#08081a", "rgb(0,0,0)", "rgba(0,0,0,.5)", "hsl(200 50% 50%)",
    "color(display-p3 1 0 0)", "oklch(0.7 0.1 200)", "transparent", "currentColor",
  ]) {
    test(`${v} is a color`, () => expect(isColor(v)).toBe(true));
  }

  for (const v of [
    "rgb(0,0,0) 0 0 10px",       // box-shadow
    "hsl(0,0%,0%) 10px",
    "#fff 1px solid",            // border
    "rgb(0,0,0) 0 0 calc(1px)",  // trailing paren must not fool the scan
    "1px solid black",
    "block",
  ]) {
    test(`${v} is NOT a color`, () => expect(isColor(v)).toBe(false));
  }

  test("a box-shadow pair interpolates per-number, not through color-mix", () => {
    const r = interpolateStrings("rgb(0,0,0) 0 0 10px", "rgb(0,0,0) 0 0 20px", 0.5);
    expect(r).not.toContain("color-mix");
    expect(r).toBe("rgb(0,0,0) 0 0 15px");
  });
});
