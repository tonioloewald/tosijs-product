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
bun run test             # Bun test runner (no tests currently)
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

### Scroll progress flow

1. A single global `scroll` event listener (RAF-throttled) drives all `TosiProductSection` instances.
2. Each section calculates `progress = clamp(-rect.top / scrollAmount, 0, 1)`.
3. Section queries children with `[data-scroll-animate]` or `[data-scroll-range]` and dispatches progress.
4. Child elements receive progress via `setScrollProgress(localProgress)` if they implement it, or are handled by type detection (Lottie → `goToAndStop`, video → `currentTime`, B3d → camera rotation).
5. `data-scroll-range="start,end"` constrains an element's animation to a sub-range of the section's progress.

### Key conventions

- **Declarative-first**: prefer HTML attributes over JS APIs. The IIFE build enables zero-JS page authoring.
- **Progress is always 0→1**: all animation values are normalized.
- **Mosaic filenames encode grid info**: `name_COLSxROWS_TOTAL.webp` — `TosiFilmstrip` auto-parses this.
- **IIFE build** (`dist/index.js`) is self-contained (bundles tosijs + tosijs-ui) and exposes `globalThis.tosijs`, `globalThis.tosijsUi`, and `globalThis.tosijsProduct`. Entry point: `src/index-iife.ts`.
- **Peer dependencies**: `tosijs` (>=1.4.0) and `tosijs-ui` (>=1.0.6) are required. Dev uses local `file:` links to sibling directories `../tosijs` and `../tosijs-ui`.

### CLI tool

`bin/tosi-mosaic.ts` converts video files to WebP mosaic grids. Requires `ffmpeg`/`ffprobe` installed.

```bash
bunx tosi-mosaic <video-file> [-f frames] [-w width] [-q quality] [-r fps]
```

## Source layout

- `src/tosi-product.ts` — `TosiProduct`, `TosiProductSection`, `TosiScrollMapper` + global scroll handler
- `src/tosi-filmstrip.ts` — `TosiFilmstrip` (canvas mosaic renderer)
- `src/tosi-interpolator.ts` — `TosiInterpolator`, `TosiWaypoint`, `interpolateStrings`
- `src/waypoints.ts` — `interpolateWaypoints` helper (numeric interpolation with easeInOutQuad)
- `src/index.ts` — re-exports all public API
- `src/index-iife.ts` — IIFE entry point; assigns `tosijs`, `tosijsUi`, `tosijsProduct` to `globalThis`
- `dev.ts` — build script + dev server (ESM build marks tosijs/tosijs-ui as external; IIFE bundles everything)
- `demo/index.html` + `demo/index.ts` — ESM demo app
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
