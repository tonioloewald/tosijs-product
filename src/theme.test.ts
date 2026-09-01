import { describe, expect, test } from "bun:test";
import { interpolateThemeValue, isColor } from "./waypoints";
import { resolveThemeSource } from "./tosi-product";

// Coverage for the theme system — the behaviour the old demo/theme.html
// exercised by eye. Two deterministic seams: how a single CSS custom-property
// value blends (interpolateThemeValue), and which theme is in force at a given
// point in the runway (resolveThemeSource).

const section = (attrs: Record<string, string> = {}) => {
  const el = document.createElement("tosi-product-section");
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return { element: el };
};

/** A non-section interlude — a markdown block or embed host between sections. */
const interlude = () => ({ element: document.createElement("div") });

describe("isColor", () => {
  test("recognises hex, rgb, hsl and color()", () => {
    expect(isColor("#08081a")).toBe(true);
    expect(isColor("rgb(1 2 3)")).toBe(true);
    expect(isColor("hsl(200 50% 50%)")).toBe(true);
    expect(isColor("color(display-p3 1 0 0)")).toBe(true);
  });

  test("recognises the named colors it supports, and tolerates whitespace", () => {
    expect(isColor("transparent")).toBe(true);
    expect(isColor("currentColor")).toBe(true);
    expect(isColor("  black  ")).toBe(true);
  });

  test("rejects non-colors", () => {
    expect(isColor("1rem")).toBe(false);
    expect(isColor("sans-serif")).toBe(false);
    expect(isColor("")).toBe(false);
  });
});

describe("interpolateThemeValue", () => {
  test("pins to the endpoints", () => {
    expect(interpolateThemeValue("#000", "#fff", 0)).toBe("#000");
    expect(interpolateThemeValue("#000", "#fff", 1)).toBe("#fff");
    // Out-of-range progress clamps rather than extrapolating.
    expect(interpolateThemeValue("#000", "#fff", -0.5)).toBe("#000");
    expect(interpolateThemeValue("#000", "#fff", 1.5)).toBe("#fff");
  });

  test("identical values short-circuit", () => {
    expect(interpolateThemeValue("#abc", "#abc", 0.5)).toBe("#abc");
  });

  test("blends two colors through color-mix", () => {
    expect(interpolateThemeValue("#000", "#fff", 0.5)).toBe(
      "color-mix(in srgb, #000 50%, #fff)"
    );
    // The from-weight is (1 - t): a quarter of the way across is still 75% from.
    expect(interpolateThemeValue("#000", "#fff", 0.25)).toBe(
      "color-mix(in srgb, #000 75%, #fff)"
    );
  });

  test("color-mix percentage is free of float noise", () => {
    // (1 - 0.7) * 100 === 30.000000000000004 in IEEE754. Valid CSS, but we emit
    // a clean number so the computed custom property stays readable.
    expect(interpolateThemeValue("#000", "#fff", 0.7)).toBe(
      "color-mix(in srgb, #000 30%, #fff)"
    );
  });

  test("interpolates numbers inside non-color values", () => {
    expect(interpolateThemeValue("0px", "100px", 0.5)).toBe("50px");
    expect(interpolateThemeValue("0px 0px", "10px 20px", 0.5)).toBe("5px 10px");
    // Fractional results keep precision but drop trailing zeros.
    expect(interpolateThemeValue("0rem", "1rem", 0.25)).toBe("0.25rem");
  });

  test("interpolates negative numbers", () => {
    expect(interpolateThemeValue("0px", "-100px", 0.5)).toBe("-50px");
  });

  test("steps at the midpoint when values are not numerically comparable", () => {
    // Different number counts -> no sane per-number blend.
    expect(interpolateThemeValue("0px", "10px 20px", 0.4)).toBe("0px");
    expect(interpolateThemeValue("0px", "10px 20px", 0.6)).toBe("10px 20px");
    // No numbers at all.
    expect(interpolateThemeValue("serif", "sans-serif", 0.4)).toBe("serif");
    expect(interpolateThemeValue("serif", "sans-serif", 0.6)).toBe("sans-serif");
  });
});

describe("resolveThemeSource", () => {
  test("falls back to the default theme when nothing declares one", () => {
    const items = [section(), section()];
    expect(resolveThemeSource(items, 1, 0.5, "midnight")).toEqual({
      fromName: "midnight",
      toName: "midnight",
      t: 0,
    });
  });

  test("a constant `theme` holds steady across its whole pin", () => {
    const items = [section({ theme: "paper" })];
    for (const p of [0, 0.5, 1]) {
      expect(resolveThemeSource(items, 0, p, "midnight")).toEqual({
        fromName: "paper",
        toName: "paper",
        t: 0,
      });
    }
  });

  test("`theme-from`/`theme-to` interpolates over the active item's progress", () => {
    const items = [section({ "theme-from": "midnight", "theme-to": "paper" })];
    expect(resolveThemeSource(items, 0, 0.25, "midnight")).toEqual({
      fromName: "midnight",
      toName: "paper",
      t: 0.25,
    });
  });

  test("a passed theme-transition holds at its to-value, it does not rewind", () => {
    // This is the subtle one: once the gradient section is behind us, the page
    // must stay on `paper` — not snap back to `midnight` or to the default.
    const items = [
      section({ "theme-from": "midnight", "theme-to": "paper" }),
      section(),
    ];
    expect(resolveThemeSource(items, 1, 0.5, "slate")).toEqual({
      fromName: "midnight",
      toName: "paper",
      t: 1,
    });
  });

  test("non-section interludes inherit the nearest preceding theme", () => {
    // A markdown block / embed host between two themed sections must not snap
    // the whole page back to the default theme.
    const items = [section({ theme: "paper" }), interlude(), interlude()];
    expect(resolveThemeSource(items, 2, 0.5, "midnight")).toEqual({
      fromName: "paper",
      toName: "paper",
      t: 0,
    });
  });

  test("the nearest preceding theme wins over an earlier one", () => {
    const items = [
      section({ theme: "midnight" }),
      section({ theme: "paper" }),
      interlude(),
    ];
    expect(resolveThemeSource(items, 2, 0.5, "midnight").fromName).toBe("paper");
  });

  test("a lone theme-from (no theme-to) is treated as a constant theme", () => {
    const items = [section({ "theme-from": "paper" })];
    expect(resolveThemeSource(items, 0, 0.5, "midnight")).toEqual({
      fromName: "paper",
      toName: "paper",
      t: 0,
    });
  });
});
