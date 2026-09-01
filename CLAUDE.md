# CLAUDE.md

> **Shared engineering practices** live at
> **https://github.com/tonioloewald/tosijs-coding-practices** — and, when checked out beside
> this repo, at [`../tosijs-coding-practices`](../tosijs-coding-practices/README.md). Read that
> index first for the cross-project defaults (development, testing, code quality, performance,
> review, releasing, deployment, and the **observant** tosijs/tjs stack). This file records only
> what is **specific to or divergent from** those defaults — when they conflict, this file wins.
>
> Those docs are **living, not graven in stone.** Don't rewrite them unprompted, but do speak up:
> voice concerns, flag inconsistencies, and suggest improvements as you work. Continuous
> improvement is the goal — see the repo's `CONTRIBUTING.md`.


This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`tosijs-product` is a cinematic product page component library for `tosijs`. It provides scroll-linked animation components for "Apple-style" product storytelling. Supports Lottie, video (via WebP mosaics), BabylonJS 3D, Mapbox, SVG, and declarative CSS interpolation — all driven by scroll position.

**Runtime/tooling:** Bun exclusively (not npm/yarn/node). TypeScript, ES2022 target.

## Commands

```bash
bun install              # Install dependencies
bun run start            # Build, then start the doc-site dev server (bin/site.ts)
bun run build            # Build the doc site + library, then exit (bin/site.ts --build)
bun run format           # ESLint + Prettier
bun run test             # Bun test runner (interpolation, theme, embedding)
bun test src/theme.test.ts           # Run a single test file
bun tsc --noEmit         # Typecheck (NOT run by the build — see below)
```

**The build does not typecheck.** `buildLibrary()` invokes `tsc` with `.nothrow()` purely to
emit declarations, so type errors never fail `bun run build` — they just silently produce
worse `.d.ts`. Run `bun tsc --noEmit` yourself before considering a change done.

### Testing the scroll engine

Tests preload `happydom.ts` (see `bunfig.toml`) for a DOM in Bun. The engine is tested
through **pure exported seams**, not by driving live components:

| Seam                                                  | Covers                                                       |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| `interpolateStrings`, `interpolateWaypoints`           | CSS/numeric interpolation between waypoints                  |
| `interpolateThemeValue`, `isColor`, `resolveThemeSource` | Theme blending, and which theme is in force at a runway point |
| `findEnclosingSection`, `nearestEnclosingProduct`, `rangeProgress` | Ownership (sibling + nested engines), sub-range mapping |

**Never `document.body.appendChild` a `<tosi-product>` in a test.** Connecting it upgrades
the custom element, and its `connectedCallback` registers listeners that keep happy-dom's
event loop alive — `bun test` then hangs forever with no output instead of failing. Build
trees **detached** (`div.innerHTML = …`, no append): the seams above are pure `parentElement`
walks, so a detached, un-upgraded tree exercises them identically.

**Build pipeline** (`bin/site.ts`): a thin wrapper over `tosijs-ui/site`'s reusable doc-system. Two stages:

1. `buildSite(siteConfig)` (from `tosijs-ui/site`) renders the static doc site into `docs/` — scans `docPaths` (`src/` doc-comment blocks + `README.md` as the home page + `src/docs/*.md`), bundles the `demo/site.ts` hydration entry to IIFE, copies `staticDirs`, and emits `llms.txt`. Config lives in `tosijs-product-site.config.ts`.
2. `buildLibrary()` produces the npm artefacts in `dist/`: `dist/module.js` (ESM, tosijs/tosijs-ui external), `dist/index.js` (self-contained IIFE for CDN), and flattened `dist/*.d.ts` (via `tsc --emitDeclarationOnly`, then moved up out of `dist/src/`).

`docs/` is **generated output** — `buildSite` runs `rm -rf docs/` first, so never hand-edit it or put source `.md` there (source docs live in `src/docs/`).

### Dev server

`bun run start` serves over **HTTPS on 8788** — https://localhost:8788 (`port` in the site config; 8787 is tosijs-ui's). It requires `tls/key.pem` + `tls/certificate.pem`, which are **gitignored** (locally-trusted, machine-specific): on a fresh clone the server refuses to start until you run `bunx tosijs-dev-certs` (needs `mkcert`).

To drive the running site (scroll testing, DOM inspection, console), prefer **haltija** over other browser automation. **`bun run start` already spawns the channel** — `haltijaDev: true` in the site config injects a localhost-gated loader into served HTML, so any tab on https://localhost:8788 shows up in `hj windows` with nothing else to launch. Do **not** also run `bunx haltija@latest -f`: that starts a second, differently-versioned server against the same 8700/8701, and `hj where` then reports whichever booted first. Set `haltijaDev: false` (or `HALTIJA_DEV=0`) to opt out. Then `hj windows`, `hj --window <id> eval '<js>'`, `hj navigate`, `hj console`. It can't reach localhost from a `file://` URL, so always point it at the dev server. Two traps: a **backgrounded tab has rAF stopped**, so tosijs never finishes rendering and `hj eval` returns plausible-but-wrong layout numbers — bring the tab to the front first; and `hj screenshot` on a plain browser tab returns a *schematic*, not pixels, so judge visual design with real screenshots.

### README is the cinematic landing page

The doc-system renders `README.md` as the home page. `marked` runs with **no sanitizer**, so raw (non-fenced) HTML in the README — e.g. a literal `<tosi-product>…</tosi-product>` — is pre-rendered into the static `<article class="doc-content">` and then hydrated by `/iife.js` (our `bundleEntry: demo/site.ts`). This is how the README hosts the full cinematic narrative as **plain declarative HTML**, no JS orchestration. Conventions:

- **Contiguity:** a raw-HTML block ends at the first blank line (CommonMark), so the whole `<style>`+`<tosi-product>` block must contain **no blank lines**. Scope its CSS under a wrapper class (we use `.tp-hero`).
- **No `<script>` execution** and **no `app.themes`** in raw markdown HTML — style with a `<style>` block (CSS vars), and use only declarative scenes. As of `tosijs-ui@1.6.16` all media scenes (including `<tosi-3d src="/x.glb" hero-light fov="0.6" clear-color="transparent">`) are declarative, so the whole narrative is pure HTML — nothing left that requires a JS `<tosi-example>` block. (`<tosi-example>` remains available when you *want* a maximizable live-code demo.)
- **Assets at web root:** `staticDirs: ["demo/assets"]` flattens files to `/` — reference `/agent-owl.mp4`, `/macbook_neo.glb`, etc., not `assets/…`.
- **Scene height:** use `var(--tosi-view-size, 100vh)` (the engine's measured viewport in the doc scroll container), not `100vh`.
- **Per-page SEO** via a single-line JSON HTML comment after the H1: `<!--{ "headTitle": "…", "description": "…", "keywords": [ … ] }-->`.
- **`"layout"` in that same metadata comment** controls the page box (`tosijs-ui@1.12.2+`). The **README uses `"full-screen"`**: no reading column, no gutter, and no nav column, so the hero gets the entire window — a hamburger in the navbar brings the nav back, and it stays offered. **Component demo pages use `"full-width"`**, which drops only the measure and keeps the nav, since those pages are prose with one full-bleed demo band in the middle. Each page then restores a measure on its own non-demo children. **Use `44rem`, never `44em`, for that restored measure:** `em` resolves against the *element's* font-size, so an `<h1>` at 2× body text would get an 88em column.
- **`overflow: visible !important` is still needed** on a `.doc-content` hosting the engine: the doc-browser sets `overflow: hidden` inline with no variable to route around it, and that kills `position: sticky`. Filed upstream ([tosijs-ui#119](https://github.com/tonioloewald/tosijs-ui/issues/119)); `max-width` and `padding` no longer need forcing.
- **`editableSources: true`** enables the dev "Edit page source → Save/Download" flow.
- **`haltijaDev: true`** makes the dev server inject a localhost-gated haltija loader into served HTML, so `hj` can drive https://localhost:8788 without launching haltija against the page yourself. Never bundled, never in `docs/`. Note the injected `component.js` is haltija's own tosijs build — its `elementCreator` deprecation warnings in the console are its, not ours.

Plan (in progress): README = full declarative narrative demo; `src/docs/*` = per-component pages with small maximizable live-example demos.

## Architecture

`tosi-product` is a **scroll engine**: a single host element owns the runway, hosts a sticky viewport-sized window in shadow DOM, and translates an absolutely-positioned stack via `transform` as the user scrolls. Sections are dumb containers that pin then exit. This replaced an earlier per-section sticky model (now removed).

### Component model

All components extend `tosijs`'s `Component` class (Custom Elements with shadow DOM). Each class has a corresponding camelCase factory function created via `.elementCreator({ tag })`:

| Class                 | Tag                       | Factory               | Role                                                                                                                                                                                                                                 |
| --------------------- | ------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TosiProduct`         | `<tosi-product>`          | `tosiProduct`         | Scroll engine. Owns runway, sticky window, and stack translation. Hosts theme registry. Detects nesting (follower mode).                                                                                                             |
| `TosiProductSection`  | `<tosi-product-section>`  | `tosiProductSection`  | Slotted container with `scroll` (pin duration), `theme`/`theme-from`/`theme-to`. Forwards pin progress to `[data-scroll-animate]` descendants.                                                                                       |
| `TosiProductHeader`   | `<tosi-product-header>`   | `tosiProductHeader`   | Sticky overlay header that slides in once `window.scrollY > threshold`. Inherits theme via CSS cascade.                                                                                                                              |
| `TosiFilmstrip`       | `<tosi-filmstrip>`        | `tosiFilmstrip`       | Canvas-based frame animator using WebP/PNG mosaic grids                                                                                                                                                                              |
| `TosiInterpolator`    | `<tosi-interpolator>`     | `tosiInterpolator`    | Declarative CSS property interpolation between waypoints                                                                                                                                                                             |
| `TosiWaypoint`        | `<tosi-waypoint>`         | `tosiWaypoint`        | Keyframe definition for interpolator (hidden; defines `progress` + inline styles)                                                                                                                                                    |
| `TosiScrollCamera`    | `<tosi-scroll-camera>`    | `tosiScrollCamera`    | Waypoint-driven camera controller for B3d scenes (alpha/beta/radius/position/fov)                                                                                                                                                    |
| `TosiScrollTime`      | `<tosi-scroll-time>`      | `tosiScrollTime`      | Maps scroll progress to day/night cycle on B3d skybox (`from`/`to` hours)                                                                                                                                                            |
| `TosiScrollAnimation` | `<tosi-scroll-animation>` | `tosiScrollAnimation` | Scrubs a named BabylonJS AnimationGroup to scroll-driven frame                                                                                                                                                                       |
| `TosiScrollMap`       | `<tosi-scroll-map>`       | `tosiScrollMap`       | Waypoint-driven scroll controller for a tosijs-ui `<tosi-map>` (Mapbox). `<tosi-waypoint coords="lat,lng,zoom">` children become keyframes; lat/lng/zoom interpolate independently as the section pins. `easing` attr (default linear). |
| `TosiPrism`           | `<tosi-prism>`            | `tosiPrism`           | Lazy-loads PrismJS from CDN to syntax-highlight its text content (`language` attr, default `markup`). Also exports `loadPrism` / `highlightCodeBlocks` helpers for post-processing other rendered code (e.g. markdownViewer output). |

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
- **Peer dependencies**: `tosijs` (^1.8.1) and `tosijs-ui` (^1.12.7) are required. `tosijs-ui` also supplies the doc-site build system (`tosijs-ui/site`), so it's a build dependency too — it is installed **from the registry**, not `file:`-linked to the sibling `../tosijs-ui` checkout (which tracks an unreleased beta; don't assume the two agree).
- **`tjs-lang` tracks `tosijs-ui`**: when you bump the `tosijs-ui` peer, bump the `tjs-lang` devDependency to match, or the IIFE build breaks. (1.12.7 wants `tjs-lang ^0.13.1`; 1.6.22 wanted `^0.9.0`.)
- **Bumping the peers is awkward in bun**: they're peer deps, so `bun install` / `bun update` will *not* pull a newer copy into `node_modules` — it just warns `incorrect peer dependency` and, worse, `bun update` rewrites your peer ranges back down to whatever is installed. Use `bun add -d tosijs@latest tosijs-ui@latest`, which installs the new versions **and** raises the peer ranges.
- **`chokidar` is a devDependency, not optional in practice.** It's an optional peer of `tosijs-ui`, but the dev server's watcher imports it and refuses to start without it. `@resvg/resvg-js` is the other optional peer; it's only for the ePub build, which we don't use.
- **Don't run `bun run build` while the dev server is up.** Since `tosijs-ui@1.12.5` a build lock refuses the second builder by name and pid rather than letting the two `rm -rf docs/` on each other.
- **Never run the dev server on `tosijs-ui` < 1.6.22.** `buildSite()` called `Bun.build()` in-process and Bun's bundler never returns its native arena, so RSS grew monotonically per rebuild (invisible to `Bun.gc()` and to heap profilers — the JS heap stays flat). A multi-day watch session reached **136GB RSS**. 1.6.22 moves the bundle to a child process and adds an RSS watchdog (`memoryLimitMb`, default 4096).
- **Review reports live at `reviews/<version>-<slug>.md` at the repo ROOT** — never `docs/reviews/`.
  In this project that path is doubly wrong: `buildSite` does `rm -rf docs/` on every build (the
  report is deleted), and `docs/` is the published GitHub Pages root (it would also be public).
  Follow-ups get routed out of the report into `TODO.md` (ours) or `UPSTREAM.md` + a filed issue.
- **Build publishable artifacts from a clean dependency install.** `rm -rf node_modules && bun
  install --frozen-lockfile` first. A `node_modules` mutated by a few `bun add`/`bun remove`
  cycles leaves **nested duplicate copies of hoisted transitives** — six sibling `@codemirror`
  packages each got their own — and the IIFE bundles every copy: same lockfile, **625kB larger
  bundle**, nothing in the build output saying so. From a clean install the build is
  byte-reproducible.
- **Verify a release from a clean tree, not your working copy.** A stale `node_modules` has twice
  produced a red suite that was not a code defect. Recipe: `pkill -f "bun bin/site.ts"` (the build
  lock refuses a concurrent build), refresh `bun.lock` with `bun install` after ANY `package.json`
  edit, then copy `git ls-files` into a scratch dir and run `bun install --frozen-lockfile`,
  `bun x tsc --noEmit`, `bun test`, `bun run build` there. Check the tarball separately with
  `npm pack --dry-run` — `files` is an allowlist and has silently dropped `.d.ts` files before.
- **Changelog**: user-visible changes go in `CHANGELOG.md` under `## [Unreleased]` ([Keep a Changelog](https://keepachangelog.com/en/1.1.0/)), per the shared coding practices.
- **Upstream issues**: rough edges in `tosijs-ui` are **filed as GitHub issues on that repo**, then mirrored in `UPSTREAM.md` with the issue link — "file, don't fix". An `UPSTREAM.md` entry with no filed issue is a complaint nobody will read.

### CLI tool

`bin/tosi-mosaic.ts` converts video files to WebP mosaic grids. Requires `ffmpeg`/`ffprobe` installed.

```bash
bunx tosi-mosaic <video-file> [-f frames] [-w width] [-q quality] [-r fps]
```

## Source layout

- `src/tosi-product.ts` — `TosiProduct`, `TosiProductSection`, `TosiProductHeader`, theme system
- `src/tosi-filmstrip.ts` — `TosiFilmstrip` (canvas mosaic renderer)
- `src/tosi-interpolator.ts` — `TosiInterpolator`, `TosiWaypoint`
- `src/waypoints.ts` — **the interpolation kernels**: `interpolateStrings` (= `interpolateThemeValue`), `isColor`, `rangeT`, `interpolateWaypoints`. The interpolator and the theme system both blend "a CSS value at t"; they each owned a copy until 0.7.0 and the copies drifted (see CHANGELOG). One implementation lives here — don't add a second.
- `src/tosi-b3d-scroll.ts` — `TosiScrollCamera`, `TosiScrollTime`, `TosiScrollAnimation` (B3d scroll controllers; use `<tosi-waypoint>` children for camera keyframes)
- `src/tosi-scroll-map.ts` — `TosiScrollMap` (Mapbox scroll controller; finds an enclosing/sibling `<tosi-map>`, flies between `<tosi-waypoint coords="lat,lng,zoom">` keyframes)
- `src/tosi-prism.ts` — `TosiPrism` component + reusable `loadPrism(languages?)` and `highlightCodeBlocks(root)` helpers (Prism loads lazily from jsDelivr CDN). Renamed from `tosi-code` in v0.6.x to avoid clashing with tosijs-ui's `<tosi-code>` (ace-based editor).
- `src/interpolation.test.ts` — tests for `interpolateStrings` and `interpolateWaypoints`
- `src/theme.test.ts` — tests for `interpolateThemeValue`, `isColor`, `resolveThemeSource`
- `src/embedding.test.ts` — tests for engine ownership (sibling/nested engines) and `rangeProgress`
- `src/index.ts` — re-exports all public API
- `src/index-iife.ts` — IIFE entry point; assigns `tosijs`, `tosijsUi`, `tosijsProduct` to `globalThis`
- `src/docs/*.md` — extra doc-site pages (`getting-started.md`, `components.md`) scanned by `buildSite`
- `bin/site.ts` — build entry (doc site via tosijs-ui/site + library via `Bun.build`/`tsc`)
- `tosijs-product-site.config.ts` — doc-site config (`docPaths`, `staticDirs`, `bundleEntry`, etc.)
- `demo/site.ts` — doc-site hydration bundle (`bundleEntry`); registers custom elements + wires the doc-system's live-example `context` to `tosijs-product` exports
- `demo/assets/` — media (`staticDirs`); flattened to the **web root** at build, so reference `/agent-owl.mp4`, `/macbook_neo.glb`, not `assets/…`
- `docs/` — **generated** static site output (wiped and rebuilt by `buildSite`; do not edit). **GitHub Pages serves the site from `main` @ `/docs`** — the built site uses absolute `/…` asset paths, so `docs/` must be the web root. Don't repoint Pages at the repo root.
- `UPSTREAM.md` — notes on rough edges found while adopting `tosijs-ui/site`, to raise upstream

## tosijs framework essentials

This library builds on `tosijs` and `tosijs-ui`. Key patterns to follow:

### Component authoring

- Extend `Component` from `tosijs`. Use `static initAttributes = { ... }` for declared attributes with defaults.
- `content()` runs once to build shadow DOM. `render()` runs on attribute changes for structural updates. Bindings handle content updates — don't manually walk the DOM in render.
- Use `static styleSpec = { ':host': { ... } }` for component styles (`:host` is rewritten automatically).
- Export both the class (`TosiFoo`) and a factory (`tosiFoo = TosiFoo.elementCreator({ tag: 'tosi-foo' })`). Note: tosijs now warns that both `elementCreator({ tag })` and `static styleSpec` are **deprecated** (use `static preferredTagName` / `static shadowStyleSpec`). Every factory here still uses the old form — migrating is a pending chore, so don't be surprised by the warnings in test output.

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
