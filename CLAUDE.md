# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`tosijs-product` is a cinematic product page component library for `tosijs`. It provides scroll-linked animation components for "Apple-style" product storytelling. Supports Lottie, video (via WebP mosaics), BabylonJS 3D, Mapbox, SVG, and declarative CSS interpolation — all driven by scroll position.

**Runtime/tooling:** Bun exclusively (not npm/yarn/node). TypeScript, ES2022 target.

## Commands

```bash
bun install              # Install dependencies
bun run start            # Dev server with watch mode (port 8788)
bun run build            # Build library (ESM + IIFE) and demo
bun run format           # ESLint + Prettier
bun run test             # Bun test runner (currently covers interpolation helpers)
```

The build is a custom script (`dev.ts`) using `Bun.build` — it produces `dist/module.js` (ESM), `dist/index.js` (IIFE), `demo/index.js`, `demo/embed.js`, and `demo/theme.js`.

## Architecture

`tosi-product` is a **scroll engine**: a single host element owns the runway, hosts a sticky viewport-sized window in shadow DOM, and translates an absolutely-positioned stack via `transform` as the user scrolls. Sections are dumb containers that pin then exit. This replaced an earlier per-section sticky model (now removed).

### Component model

All components extend `tosijs`'s `Component` class (Custom Elements with shadow DOM). Each class has a corresponding camelCase factory function created via `.elementCreator({ tag })`:

| Class                 | Tag                       | Factory               | Role                                                                                                                                           |
| --------------------- | ------------------------- | --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `TosiProduct`         | `<tosi-product>`          | `tosiProduct`         | Scroll engine. Owns runway, sticky window, and stack translation. Hosts theme registry. Detects nesting (follower mode).                       |
| `TosiProductSection`  | `<tosi-product-section>`  | `tosiProductSection`  | Slotted container with `scroll` (pin duration), `theme`/`theme-from`/`theme-to`. Forwards pin progress to `[data-scroll-animate]` descendants. |
| `TosiProductHeader`   | `<tosi-product-header>`   | `tosiProductHeader`   | Sticky overlay header that slides in once `window.scrollY > threshold`. Inherits theme via CSS cascade.                                        |
| `TosiFilmstrip`       | `<tosi-filmstrip>`        | `tosiFilmstrip`       | Canvas-based frame animator using WebP/PNG mosaic grids                                                                                        |
| `TosiInterpolator`    | `<tosi-interpolator>`     | `tosiInterpolator`    | Declarative CSS property interpolation between waypoints                                                                                       |
| `TosiWaypoint`        | `<tosi-waypoint>`         | `tosiWaypoint`        | Keyframe definition for interpolator (hidden; defines `progress` + inline styles)                                                              |
| `TosiScrollCamera`    | `<tosi-scroll-camera>`    | `tosiScrollCamera`    | Waypoint-driven camera controller for B3d scenes (alpha/beta/radius/position/fov)                                                              |
| `TosiScrollTime`      | `<tosi-scroll-time>`      | `tosiScrollTime`      | Maps scroll progress to day/night cycle on B3d skybox (`from`/`to` hours)                                                                      |
| `TosiScrollAnimation` | `<tosi-scroll-animation>` | `tosiScrollAnimation` | Scrubs a named BabylonJS AnimationGroup to scroll-driven frame                                                                                 |
| `TosiCode`            | `<tosi-code>`             | `tosiCode`            | Lazy-loads PrismJS from CDN to syntax-highlight its text content (`language` attr, default `html`)                                             |

### Scroll engine flow

1. `<tosi-product>` walks light DOM children at relayout; for each child it records `naturalSize`, `pinDuration` (= `scroll% * viewport` for sections, 0 for non-sections), and `exitDuration` (= `naturalSize`). Total runway = sum of `pinDuration + exitDuration`.
2. Host outer dim = `runway + viewport`. Inside shadow DOM, `.window` is `position: sticky; height: 100vh; overflow: hidden`. Children render inside `.stack` (absolutely positioned) which the engine translates.
3. On scroll, `local = scrollPos − hostStart`. Find the active item:
   - Pin phase: `translate = -item.offset`, `progress = (local − rangeStart) / pinDuration`.
   - Exit phase: `translate = -item.offset − exitProgress * naturalSize`, `progress = 1`.
4. Translate is clamped to `≥ -(stackSize − viewport)` so the tail stays at viewport bottom rather than blanking.
5. For each section, `setScrollProgress(progress)` is dispatched. Section iterates its `[data-scroll-animate]` / `[data-scroll-range]` descendants:
   - Skips animators whose nearest enclosing `tosi-product` differs from this section's product (those belong to a nested engine).
   - For each: sets `--local-progress`, then dispatches via the descendant's `setScrollProgress` if implemented; otherwise handles `data-scroll-animate="currentTime"` (video) and `data-scroll-animate="lottie"` (Bodymovin) explicitly.
6. `prefers-reduced-motion: reduce` skips child animations (only fires `scrollCallback`).

### Nested follower mode

A `<tosi-product>` placed inside a `<tosi-product-section>` detects the enclosing section, marks itself `data-scroll-animate="tosi-product"`, and accepts `setScrollProgress(p)` from the parent section instead of attaching to document scroll. In follower mode it also sizes to fill its parent (no host height computation), drops sticky positioning on `.window` (the parent section already pins), and scopes its `themeTarget` to itself instead of `document.documentElement` to avoid fighting the outer engine for `:root` vars.

### Theme system

Themes are dictionaries of CSS custom properties registered on the engine:

```ts
app.themes = {
  midnight: { '--bg': '#08081a', '--fg': '#f0f0f5', ... },
  paper: { '--bg': '#f5f1e8', '--fg': '#1a1815', ... },
};
app.defaultTheme = 'midnight';
```

Sections declare:

- `theme="midnight"` for a constant theme during pin
- `theme-from="midnight" theme-to="paper"` to interpolate over the pin progress

Color values blend through `color-mix(in srgb, ...)`. Numeric strings interpolate per-number; everything else steps at the midpoint. Resolved variables are written to `document.documentElement` by default, so external siblings (page header, sticky overlay, footer) re-theme through the cascade. Configurable via `app.themeTarget`.

`_applyTheme` walks back from the active item to find the nearest preceding theme-bearing item, so non-section interludes (markdown blocks, embed hosts) inherit the most recent section's theme instead of snapping to default.

### Key attributes

- **`scroll`** (on `tosi-product-section`): pin duration in viewport-percent. `100` (default) = 1× viewport of pinning. The exit phase (section scrolls out at 1:1) is added on top automatically — total scroll claimed = `pinDuration + naturalSize`.
- **`direction`** (on `tosi-product`): `"vertical"` (default) or `"horizontal"`. Horizontal engines lay out side-to-side; their host width = `runway + viewport_width`.
- **`debug`** (on `tosi-product`): shows a fixed overlay with current local position / translate / active section + progress.
- **`theme`** / **`theme-from`** / **`theme-to`** (on `tosi-product-section`): see Theme system above.
- **`threshold`** (on `tosi-product-header`): `window.scrollY` past which the header slides into view. Default: `50`.
- **`easing`** (on `tosi-interpolator`): `"ease-in-out"` applies easeInOutQuad between waypoints. Default: linear.
- **`progress`** (on `tosi-waypoint`): 0→1 value defining the keyframe position.
- **`data-scroll-range="start,end"`**: scopes an animator to a sub-range of its enclosing section's progress.
- **`data-scroll-animate`**: marks an element as a scroll-driven animator. Special values `"currentTime"` (video scrubbing) and `"lottie"` (Bodymovin) are handled by the section directly; other values dispatch through `setScrollProgress`.

### Key conventions

- **Declarative-first**: prefer HTML attributes over JS APIs. The IIFE build enables zero-JS page authoring.
- **Progress is always 0→1**: pin progress maps to this range; exit phase pins at 1.
- **Mosaic filenames encode grid info**: `name_COLSxROWS_TOTAL.webp` — `TosiFilmstrip` auto-parses this.
- **IIFE build** (`dist/index.js`) is self-contained (bundles tosijs + tosijs-ui) and exposes `globalThis.tosijs`, `globalThis.tosijsUi`, and `globalThis.tosijsProduct`. Entry point: `src/index-iife.ts`.
- **Peer dependencies**: `tosijs` (^1.5.7) and `tosijs-ui` (^1.3.0) are required. Dev uses local `file:` links to sibling directories `../tosijs` and `../tosijs-ui`.

### CLI tool

`bin/tosi-mosaic.ts` converts video files to WebP mosaic grids. Requires `ffmpeg`/`ffprobe` installed.

```bash
bunx tosi-mosaic <video-file> [-f frames] [-w width] [-q quality] [-r fps]
```

## Source layout

- `src/tosi-product.ts` — `TosiProduct`, `TosiProductSection`, `TosiProductHeader`, theme system, `interpolateThemeValue`
- `src/tosi-filmstrip.ts` — `TosiFilmstrip` (canvas mosaic renderer)
- `src/tosi-interpolator.ts` — `TosiInterpolator`, `TosiWaypoint`, `interpolateStrings`
- `src/waypoints.ts` — `interpolateWaypoints` helper (numeric interpolation with easeInOutQuad)
- `src/tosi-b3d-scroll.ts` — `TosiScrollCamera`, `TosiScrollTime`, `TosiScrollAnimation` (B3d scroll controllers; use `<tosi-waypoint>` children for camera keyframes)
- `src/tosi-code.ts` — `TosiCode` (Prism-highlighted code block; loads PrismJS lazily from jsDelivr CDN)
- `src/interpolation.test.ts` — tests for `interpolateStrings` and `interpolateWaypoints`
- `src/index.ts` — re-exports all public API
- `src/index-iife.ts` — IIFE entry point; assigns `tosijs`, `tosijsUi`, `tosijsProduct` to `globalThis`
- `dev.ts` — build script + dev server. ESM build marks tosijs/tosijs-ui as external; IIFE bundles everything. Also produces `demo/index.js`, `demo/embed.js`, `demo/theme.js`.
- `demo/index.html` + `demo/index.ts` — main demo (page chrome, theme transitions, embedded engines)
- `demo/embed.html` + `demo/embed.ts` — focused embeddability test (siblings + nested horizontal)
- `demo/theme.html` + `demo/theme.ts` — focused theme transition test
- `demo/example.html` — pure HTML demo using only the IIFE build

## tosijs framework essentials

This library builds on `tosijs` and `tosijs-ui`. Key patterns to follow:

### Component authoring

- Extend `Component` from `tosijs`. Use `static initAttributes = { ... }` for declared attributes with defaults.
- `content()` runs once to build shadow DOM. `render()` runs on attribute changes for structural updates. Bindings handle content updates — don't manually walk the DOM in render.
- Use `static styleSpec = { ':host': { ... } }` for component styles (`:host` is rewritten automatically).
- Export both the class (`TosiFoo`) and a factory (`tosiFoo = TosiFoo.elementCreator({ tag: 'tosi-foo' })`).

### Element creators and elements

- Use factory functions (`tosiProduct(...)`, `tosiSelect(...)`) to create elements, not `new` or `document.createElement`.
- Destructure `elements` for HTML helpers: `const { div, span, slot } = elements`.
- Pass attributes, properties, event handlers, and children in a single props object.
- **`on[A-Z]` keys are event listeners, not properties.** `elementSet` intercepts any key matching `/^on[A-Z]/` and registers it as a DOM event listener via `on(elt, eventType, handler)`. To set a callback _property_ (e.g. `onProgress`), use the `apply` key instead: `{ apply(el) { el.onProgress = fn } }`.
- **`apply(el)`** is a special key in `elementSet` that calls the function with the created element. Use it to set properties that can't go through the normal attribute/property path (functions, objects, config overrides).

### State and bindings (tosijs "downhill" model)

- State lives in `tosi()` proxies. Mutations fire observers automatically — no setState/dispatch.
- Access scalar values with `.value` (e.g. `app.user.name.value = 'Bob'`).
- Pass a proxy as any element property/attribute to create a live binding automatically.
- `bindValue` for two-way binding on inputs. `bindText` for text content.
- Bind individual scalar paths, not objects — this ensures only the bound element updates.
- `observe()` is for side effects (localStorage, analytics), not rendering.
- `touch()` forces update propagation after raw mutations (e.g. inside `forEach` callbacks).

### tosijs-ui components

- Components follow HTML contract: `value` property, `change` event. Use `bindValue` for proxy binding.
- Form-associated components (`tosiSelect`, `tosiRating`, etc.) work in native `<form>` with `name` attribute.
- Theming via CSS custom properties (`--tosi-*` prefixes). Override at any cascade level.
- `tosiSelect` options: string (`'a,b,c'`), with captions (`'a=Apple,b=Banana'`), or array of objects.
- `popMenu` for context menus, `TosiDialog.alert/confirm/prompt` for dialogs, `postNotification` for toasts.
