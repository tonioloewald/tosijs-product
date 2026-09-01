/*
The interpolation kernels.

Both the CSS-property interpolator (`<tosi-interpolator>`) and the theme system
blend "a CSS value at t" — and for a while each owned a private copy of that
logic. The copies drifted: the theme copy got an `isColor` test hoisted above
the numeric branch and a wider named-color list; the interpolator copy did not,
so every all-hex-digit color it touched was read as a decimal number
(`#290000`→`#310000` blended through `#300000`, and `#100000`→`#100001` emitted
the invalid literal `#100000.5`). One kernel, exported under both names, so
they cannot drift again.
*/

/** Does this value name a color? Checked BEFORE any numeric reading — see below. */
export function isColor(s: string): boolean {
  const t = s.trim();
  return (
    t.startsWith("#") ||
    t.startsWith("rgb") ||
    t.startsWith("hsl") ||
    t.startsWith("color(") ||
    [
      "red",
      "blue",
      "green",
      "white",
      "black",
      "transparent",
      "currentColor",
    ].includes(t)
  );
}

/** Format a float for CSS: fixed precision, no trailing zeros (0.7*100 -> "70", not "70.000000000001"). */
function trimNum(v: number): string {
  return v.toFixed(4).replace(/0+$/, "").replace(/\.$/, "");
}

/**
 * Blend one CSS value into another at `t` (0→1).
 *
 * Colors blend through `color-mix(in srgb, …)`. Values containing matching runs of numbers
 * (`0.5rem 1rem`, `translateY(20px)`) interpolate per-number. Anything else steps at the
 * midpoint, since there's no meaningful in-between for e.g. a font-family.
 *
 * **The color test must come first.** A hex color is a digit-bearing string, so a
 * numeric-first reading consumes it: `#290000` scans as the single number `290000` and
 * blends arithmetically, which is wrong when it produces anything and invalid CSS when the
 * result is fractional. It is also silently wrong in the other direction — `#a0b0c0` and
 * `#d0e0f0` both scan as `0,0,0`, so the value interpolates 0→0 and never moves at all.
 */
export function interpolateStrings(from: string, to: string, t: number): string {
  if (from === to || t <= 0) return from;
  if (t >= 1) return to;
  if (isColor(from) && isColor(to)) {
    return `color-mix(in srgb, ${from} ${trimNum((1 - t) * 100)}%, ${to})`;
  }
  const numRegex = /-?\d+(?:\.\d+)?/g;
  const aNums = Array.from(from.matchAll(numRegex));
  const bNums = Array.from(to.matchAll(numRegex));
  if (aNums.length > 0 && aNums.length === bNums.length) {
    let result = "";
    let lastIndex = 0;
    for (let i = 0; i < aNums.length; i++) {
      const am = aNums[i];
      const bm = bNums[i];
      result += from.substring(lastIndex, am.index);
      const v = parseFloat(am[0]) + (parseFloat(bm[0]) - parseFloat(am[0])) * t;
      result += trimNum(v);
      lastIndex = am.index! + am[0].length;
    }
    result += from.substring(lastIndex);
    return result;
  }
  return t < 0.5 ? from : to;
}

/**
 * The theme system's name for {@link interpolateStrings}. Same function — themes blend CSS
 * custom-property values, which is the same problem the interpolator solves.
 */
export const interpolateThemeValue = interpolateStrings;

export const interpolateWaypoints = (progress: number, waypoints: any[]) => {
  if (!waypoints || waypoints.length === 0) return null;

  waypoints = [...waypoints].sort((a, b) => a.progress - b.progress);

  if (progress <= waypoints[0].progress) return waypoints[0];
  if (progress >= waypoints[waypoints.length - 1].progress) {
    return waypoints[waypoints.length - 1];
  }

  for (let i = 0; i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i];
    const wp2 = waypoints[i + 1];
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const t = rangeT(progress, wp1.progress, wp2.progress);
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

      const result: any = { progress };
      for (const k in wp1) {
        if (k !== "progress") {
          result[k] = wp1[k] + (wp2[k] - wp1[k]) * e;
        }
      }
      return result;
    }
  }
  return waypoints[0];
};

/**
 * Where `progress` sits between two waypoints, 0→1.
 *
 * Two waypoints may legitimately share a `progress` (a step change, or just an authoring
 * slip). A raw division then yields NaN or ±Infinity, which propagates into every style the
 * pair drives and freezes the animator with no error. A zero-width span has no interior, so
 * the answer is its far end.
 */
export function rangeT(progress: number, start: number, end: number): number {
  const span = end - start;
  return span === 0 ? 1 : (progress - start) / span;
}
