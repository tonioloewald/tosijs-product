import { describe, expect, test } from "bun:test";
import { interpolateStrings } from "./tosi-interpolator";
import { interpolateWaypoints } from "./waypoints";

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
