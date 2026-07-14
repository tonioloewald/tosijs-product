# Component Reference

<!--{ "headTitle": "tosijs-product — component & API reference", "description": "Every element and exported function in tosijs-product: the scroll engine, the animators, the theme system, and the JavaScript API.", "keywords": [ "reference", "api", "components", "themes" ] }-->

Each element has its own page with a live, maximizable demo — those pages are generated from the
source, so they never drift from the code. This page is the index, plus the two things that span
several elements: the **theme system** and the **JavaScript API**.

## Elements

| Element                                                 | What it does                                                                                |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [`<tosi-product>`](/tosi-product/)                       | The scroll engine. Owns the runway, pins each section, then exits it. Also hosts the themes. |
| [`<tosi-product-section>`](/tosi-product/)               | A scene. Pins for `scroll`% of the viewport, then scrolls out 1:1.                          |
| [`<tosi-product-header>`](/tosi-product/)                | Sticky overlay header that slides in past a `threshold`.                                    |
| [`<tosi-interpolator>`](/tosi-interpolator/)             | Interpolates CSS between `<tosi-waypoint>` keyframes.                                       |
| [`<tosi-waypoint>`](/tosi-interpolator/)                 | A keyframe: a `progress` plus the values that hold at it.                                   |
| [`<tosi-filmstrip>`](/tosi-filmstrip/)                   | Scrubs a WebP/PNG mosaic on a canvas — video without the decode.                            |
| [`<tosi-scroll-map>`](/tosi-scroll-map/)                 | Flies a Mapbox `<tosi-map>` between `coords` waypoints.                                     |
| [`<tosi-scroll-camera>`](/tosi-b3d-scroll/)              | Drives a BabylonJS camera (alpha/beta/radius/position/fov).                                 |
| [`<tosi-scroll-time>`](/tosi-b3d-scroll/)                | Maps progress to a day/night cycle on a B3d skybox.                                         |
| [`<tosi-scroll-animation>`](/tosi-b3d-scroll/)           | Scrubs a named BabylonJS `AnimationGroup`.                                                  |
| [`<tosi-prism>`](/tosi-prism/)                           | Syntax-highlights its text content (PrismJS, loaded lazily).                                |

## Driving anything with scroll

Two attributes do the work, and they're the whole contract between the engine and an animator:

- **`data-scroll-animate`** marks an element as scroll-driven. If it implements
  `setScrollProgress(progress)`, the section calls it. Two values are handled natively for
  elements that don't: `data-scroll-animate="currentTime"` scrubs a `<video>`, and
  `data-scroll-animate="lottie"` scrubs a Bodymovin player.
- **`data-scroll-range="start,end"`** scopes an animator to a slice of its section's progress, so
  `"0.5,1"` means "animate across the second half only." The remapped value is also published as
  the CSS custom property `--local-progress`, so you can use it directly in `calc()`.

That's the extension point: **anything with a `setScrollProgress(progress)` method can be driven by
the engine**, which is all `<tosi-scroll-map>` and the B3d controllers are.

When `prefers-reduced-motion: reduce` is set, child animations are skipped entirely; only
`scrollCallback` fires, so you can offer a static alternative.

## Theme system

Themes are named dictionaries of CSS custom properties, registered on the **engine**:

```js
const app = document.querySelector("tosi-product");

app.themes = {
  midnight: { "--bg": "#08081a", "--fg": "#f0f0f5" },
  paper: { "--bg": "#f5f1e8", "--fg": "#1a1815" },
};
app.defaultTheme = "midnight";
```

Sections then declare which theme is in force as they pin:

```html
<tosi-product-section theme="midnight">…</tosi-product-section>
<tosi-product-section theme-from="midnight" theme-to="paper">…</tosi-product-section>
```

`theme` holds a theme constant for the whole pin. `theme-from`/`theme-to` **interpolates** between
two themes across the pin progress, so the page changes mood as you scroll through the section.

| Property      | Type            | Default                    | Description                                                          |
| ------------- | --------------- | -------------------------- | -------------------------------------------------------------------- |
| `themes`      | `ThemeRegistry` | `{}`                       | Named theme dictionaries.                                            |
| `defaultTheme`| `string`        | `""`                       | Theme in force before any section declares one.                      |
| `themeTarget` | `HTMLElement`   | `document.documentElement` | Where resolved variables are written. A nested engine scopes to itself. |

Values blend according to type: colors through `color-mix(in srgb, …)`, values containing numbers
per-number, and everything else steps at the midpoint. Because the resolved variables land on
`document.documentElement` by default, **elements outside the engine re-theme too** — a page header,
a sticky nav, the footer — simply by reading the same custom properties.

Sections that declare no theme don't snap back to the default: the engine walks back to the nearest
preceding theme-bearing section, so a markdown interlude between two scenes keeps the mood of the
scene before it.

## JavaScript API

Every element also has a factory function (`tosiProduct()`, `tosiProductSection()`, …) following the
tosijs convention. Import from `tosijs-product`:

```typescript
import {
  tosiProduct,
  tosiProductSection,
  tosiProductHeader,
  tosiInterpolator,
  tosiWaypoint,
  tosiFilmstrip,
  tosiScrollMap,
  tosiScrollCamera,
  tosiScrollTime,
  tosiScrollAnimation,
  tosiPrism,
} from "tosijs-product";
```

### Helpers

The engine's pure functions are exported too. They're the seams the test suite drives, and they're
useful if you're building your own animator or debugging why a scene isn't behaving.

| Function                                             | Returns                | Description                                                                                     |
| ---------------------------------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| `rangeProgress(progress, rangeStr)`                  | `number`               | Maps a section's 0→1 progress onto a `data-scroll-range="start,end"` slice, clamped to 0→1.     |
| `interpolateStrings(a, b, t)`                        | `string`               | Interpolates the numbers inside two CSS strings — how `<tosi-interpolator>` blends keyframes.   |
| `interpolateWaypoints(progress, waypoints)`          | `number`               | Numeric interpolation across waypoints, with easeInOutQuad.                                     |
| `interpolateThemeValue(from, to, t)`                 | `string`               | Blends one theme value into another (colors via `color-mix`, numbers per-number, else steps).   |
| `isColor(s)`                                         | `boolean`              | Whether a CSS value is a color, and so should be blended rather than stepped.                   |
| `resolveThemeSource(items, activeIdx, progress, defaultTheme)` | `ThemeSource` | Which theme(s) are in force at a point on the runway, and how far between them.                 |
| `findEnclosingSection(el)`                           | `HTMLElement \| null`  | The nearest ancestor `<tosi-product-section>`.                                                   |
| `nearestEnclosingProduct(el)`                        | `HTMLElement \| null`  | The nearest ancestor `<tosi-product>` — how an engine tells its own animators from a nested engine's. |

### Types

```typescript
type ThemeMap = Record<string, string>;       // CSS custom property → value
type ThemeRegistry = Record<string, ThemeMap>; // theme name → ThemeMap

interface ThemeSource {
  fromName: string; // theme being blended out of
  toName: string;   // theme being blended into
  t: number;        // 0→1 position between them
}
```
