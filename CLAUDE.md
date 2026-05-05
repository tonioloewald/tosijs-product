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

The build is a custom script (`dev.ts`) using `Bun.build` — it produces `dist/module.js` (ESM), `dist/index.js` (IIFE), and `demo/index.js`.

## Architecture

### Component model

All components extend `tosijs`'s `Component` class (Custom Elements with shadow DOM). Each class has a corresponding camelCase factory function created via `.elementCreator({ tag })`:

| Class | Tag | Factory | Role |
|---|---|---|---|
| `TosiProduct` | `<tosi-product>` | `tosiProduct` | Top-level container wrapper |
| `TosiProductSection` | `<tosi-product-section>` | `tosiProductSection` | Scroll-linked section; sticky viewport pinning; converts scroll to 0→1 progress |
| `TosiFilmstrip` | `<tosi-filmstrip>` | `tosiFilmstrip` | Canvas-based frame animator using WebP/PNG mosaic grids |
| `TosiInterpolator` | `<tosi-interpolator>` | `tosiInterpolator` | Declarative CSS property interpolation between waypoints |
| `TosiWaypoint` | `<tosi-waypoint>` | `tosiWaypoint` | Keyframe definition for interpolator (hidden; defines `progress` + inline styles) |
| `TosiScrollMapper` | `<tosi-scroll-mapper>` | `tosiScrollMapper` | Generic scroll progress wrapper with `scrollCallback` property |
| `TosiScrollCamera` | `<tosi-scroll-camera>` | `tosiScrollCamera` | Waypoint-driven camera controller for B3d scenes (alpha/beta/radius/position/fov) |
| `TosiScrollTime` | `<tosi-scroll-time>` | `tosiScrollTime` | Maps scroll progress to day/night cycle on B3d skybox (`from`/`to` hours) |
| `TosiScrollAnimation` | `<tosi-scroll-animation>` | `tosiScrollAnimation` | Scrubs a named BabylonJS AnimationGroup to scroll-driven frame |
| `TosiCode` | `<tosi-code>` | `tosiCode` | Lazy-loads PrismJS from CDN to syntax-highlight its text content (`language` attr, default `html`) |

### Scroll progress flow

1. Per-scroll-parent listeners (via `Map<EventTarget, Set<TosiProductSection>>`) drive sections. `getScrollParent()` walks DOM checking `overflow`, skips body/documentElement, falls back to `window`.
2. Each section calculates `progress = clamp(-offset / scrollAmount, 0, 1)` (RAF-throttled). Guards against `scrollAmount <= 0` to prevent NaN/Infinity.
3. Section queries children with `[data-scroll-animate]` or `[data-scroll-range]` (cached, invalidated by MutationObserver).
4. Child elements receive progress via priority:
   - `setScrollProgress(localProgress)` if the element implements it (custom components)
   - `data-scroll-animate="currentTime"` → sets `el.currentTime` on video elements
   - `data-scroll-animate="lottie"` → `animation.goToAndStop(frame, true)` on Lottie players
   - B3d scroll components (`TosiScrollCamera`, `TosiScrollTime`, `TosiScrollAnimation`) → waypoint-interpolated camera/animation control
5. `data-scroll-range="start,end"` constrains animation to a sub-range of section progress.
6. `--local-progress` CSS custom property is set on every animated child (usable in CSS `calc()`).
7. `prefers-reduced-motion: reduce` skips all child animations (only fires `scrollCallback`).

### Key attributes

- **`scroll`** (on `tosi-product-section`): viewport-relative percentage (not pixels). `100` = 1× container dimension of scroll distance. Default: `100`.
- **`viewport`** (on `tosi-product-section`): percentage of the container's perpendicular dimension the sticky frame occupies (height for vertical, width for horizontal). `100` (default) fills the viewport. Lower values (e.g., `70`) shrink the pinned area so the section background — or the next section, near the end of the runway — peeks through the unused band. Section outer = `viewport% + scroll%` of container, so pinning duration is unaffected.
- **`direction`** (on `tosi-product-section`): `"vertical"` (default) or `"horizontal"`.
- **`debug`** (on `tosi-product-section`): shows an overlay with current progress value.
- **`overflow`** (on `tosi-product-section`): when set, progress extends beyond `[0,1]` to `[-1,2]` — `<0` while the section approaches the viewport, `>1` after it has scrolled past. Lets animations enter/exit beyond the pinned range. Default: `false`.
- **`easing`** (on `tosi-interpolator`): `"ease-in-out"` applies easeInOutQuad between waypoints. Default: linear.
- **`progress`** (on `tosi-waypoint`): 0→1 value defining the keyframe position.

### Key conventions

- **Declarative-first**: prefer HTML attributes over JS APIs. The IIFE build enables zero-JS page authoring.
- **Progress is always 0→1**: all animation values are normalized.
- **Mosaic filenames encode grid info**: `name_COLSxROWS_TOTAL.webp` — `TosiFilmstrip` auto-parses this.
- **IIFE build** (`dist/index.js`) is self-contained (bundles tosijs + tosijs-ui) and exposes `globalThis.tosijs`, `globalThis.tosijsUi`, and `globalThis.tosijsProduct`. Entry point: `src/index-iife.ts`.
- **Peer dependencies**: `tosijs` (^1.5.7) and `tosijs-ui` (^1.3.0) are required. Dev uses local `file:` links to sibling directories `../tosijs` and `../tosijs-ui`.
- **Horizontal scroll layout**: parent `tosi-product` needs `display: inline-flex; width: max-content`; sections need `flex-shrink: 0`; sticky uses `left: 0`.

### CLI tool

`bin/tosi-mosaic.ts` converts video files to WebP mosaic grids. Requires `ffmpeg`/`ffprobe` installed.

```bash
bunx tosi-mosaic <video-file> [-f frames] [-w width] [-q quality] [-r fps]
```

## Source layout

- `src/tosi-product.ts` — `TosiProduct`, `TosiProductSection`, `TosiScrollMapper` + global scroll handler (shipping v1)
- `src/tosi-product-v2.ts` — `TosiProductV2`, `TosiProductSectionV2` (in-progress prototype; see below)
- `src/tosi-filmstrip.ts` — `TosiFilmstrip` (canvas mosaic renderer)
- `src/tosi-interpolator.ts` — `TosiInterpolator`, `TosiWaypoint`, `interpolateStrings`
- `src/waypoints.ts` — `interpolateWaypoints` helper (numeric interpolation with easeInOutQuad)
- `src/tosi-b3d-scroll.ts` — `TosiScrollCamera`, `TosiScrollTime`, `TosiScrollAnimation` (B3d scroll controllers; use `<tosi-waypoint>` children for camera keyframes)
- `src/tosi-code.ts` — `TosiCode` (Prism-highlighted code block; loads PrismJS lazily from jsDelivr CDN)
- `src/interpolation.test.ts` — tests for `interpolateStrings` and `interpolateWaypoints`
- `src/index.ts` — re-exports all public API (v1 only — v2 is intentionally not exported yet)
- `src/index-iife.ts` — IIFE entry point; assigns `tosijs`, `tosijsUi`, `tosijsProduct` to `globalThis`
- `dev.ts` — build script + dev server. ESM build marks tosijs/tosijs-ui as external; IIFE bundles everything. Also produces `demo/index.js`, `demo/v2.js`, `demo/v2-embed.js`, `demo/v2-theme.js`.
- `demo/index.html` + `demo/index.ts` — ESM demo app (v1)
- `demo/v2.html` + `demo/v2.ts` — v2 prototype demo
- `demo/v2-embed.html` + `demo/v2-embed.ts` — nested v2 (follower-mode) demo
- `demo/v2-theme.html` + `demo/v2-theme.ts` — v2 theme + page-header/sticky-header demo
- `demo/example.html` — pure HTML demo using only the IIFE build

### v2 prototype architecture

`tosi-product-v2.ts` is a parallel prototype on the `tosi-product-v2` branch. It is **not yet exported from `src/index.ts`** and is reachable only through the v2 demos. Don't add it to public exports without explicit instruction.

Differences from v1:
- **`<tosi-product-v2>` owns scroll layout itself** rather than each section being independently sticky. The host listens to its scroll parent, computes a single runway from all children's `scroll` attributes, and translates a sticky `.window` element via `transform`. Sections pin for their `scroll` duration, then exit at 1:1.
- **Nested follower mode**: a `<tosi-product-v2>` placed inside a `<tosi-product-section-v2>` detects the enclosing section, tags itself `data-scroll-animate="tosi-product-v2"`, and accepts driving progress via `setScrollProgress(progress)` instead of attaching to document scroll. This lets a parent v2 engine drive an embedded v2 engine.
- Layout is recomputed via `MutationObserver` (childList + `scroll` attr) and `ResizeObserver` (children + self).
- **Theme system**: assign `app.themes = { dark: { '--bg': '#000', ... }, light: { ... } }` and optionally `app.defaultTheme = 'dark'`. Sections declare `theme="dark"` (constant) or `theme-from="dark" theme-to="light"` (interpolated during pin progress via `color-mix(in srgb, ...)`). The resolved CSS variables are written to `document.documentElement` by default so external siblings (page header / sticky overlay / footer) inherit them via the cascade. Configurable target via `app.themeTarget`.

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
- **`on[A-Z]` keys are event listeners, not properties.** `elementSet` intercepts any key matching `/^on[A-Z]/` and registers it as a DOM event listener via `on(elt, eventType, handler)`. To set a callback *property* (e.g. `onProgress`), use the `apply` key instead: `{ apply(el) { el.onProgress = fn } }`.
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
