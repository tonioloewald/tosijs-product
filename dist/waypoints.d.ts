/** Does this value name a color? Checked BEFORE any numeric reading — see below. */
export declare function isColor(s: string): boolean;
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
export declare function interpolateStrings(from: string, to: string, t: number): string;
/**
 * The theme system's name for {@link interpolateStrings}. Same function — themes blend CSS
 * custom-property values, which is the same problem the interpolator solves.
 */
export declare const interpolateThemeValue: typeof interpolateStrings;
export declare const interpolateWaypoints: (progress: number, waypoints: any[]) => any;
/**
 * Where `progress` sits between two waypoints, 0→1.
 *
 * Two waypoints may legitimately share a `progress` (a step change, or just an authoring
 * slip). A raw division then yields NaN or ±Infinity, which propagates into every style the
 * pair drives and freezes the animator with no error. A zero-width span has no interior, so
 * the answer is its far end.
 */
export declare function rangeT(progress: number, start: number, end: number): number;
