# Changelog

All notable changes to **tosijs-product** are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For releases before 0.6.1, see the git history (`git log`) and tags.

## [Unreleased]

## [0.6.2] — 2026-07-15

### Added

- **The engine's pure helpers are now exported** and documented: `rangeProgress`,
  `interpolateThemeValue`, `isColor`, `resolveThemeSource`, `findEnclosingSection`,
  `nearestEnclosingProduct`, and the `ThemeSource` type. These are the seams the test suite drives;
  they're useful when writing your own animator or working out why a scene isn't behaving. Purely
  additive — nothing existing changed shape.

### Changed

- **Peer dependencies bumped: `tosijs` `^1.6.4` → `^1.6.8`, `tosijs-ui` `^1.6.19` → `^1.6.22`**
  (and the coupled `tjs-lang` devDependency `^0.8.7` → `^0.9.1`, which `tosijs-ui@1.6.22` requires).
  The motivation is a **dev-server memory leak in `tosijs-ui/site` before 1.6.22**: `buildSite()`
  ran `Bun.build()` in-process and Bun's bundler never returns its native arena, so RSS grew
  monotonically on every rebuild — invisible to `Bun.gc()` and to heap profilers, since the JS heap
  stays flat. 1.6.22 moves the bundle into a child process and adds an RSS watchdog. Anyone running
  `bun run start` should be on 1.6.22+. No API change on our side; build, typecheck and tests are
  unchanged and green.

### Removed

- **The legacy standalone demo build.** Deleted `dev.ts` and the `build:legacy` script, plus the
  now-dead demo pages it built (`demo/{index,embed,theme}.{html,ts,js}`, `demo/test.html`) and the
  stale repo-root `index.html`. The `tosijs-ui/site` doc-system (`bin/site.ts`) has fully
  superseded them: it builds both the doc site (`docs/`) and the library (`dist/`). `demo/` now
  holds only what the doc-system consumes — `site.ts` (the hydration `bundleEntry`) and `assets/`.

- **`<tosi-scroll-mapper>` from the docs — it does not exist.** The Component Reference documented
  it (with a code example) and Getting Started's ESM snippet *imported* it, so that snippet threw.
  It was superseded by [`<tosi-scroll-map>`](/tosi-scroll-map/).

### Fixed

- **The Component Reference described an engine we no longer ship.** It claimed sections pin via
  `position: sticky` (that per-section model was replaced by the single-host runway engine), gave a
  progress formula (`clamp(-offset / scrollAmount, 0, 1)`) from the same dead design, and listed
  `direction` and `debug` as `<tosi-product-section>` attributes when both belong to
  `<tosi-product>`. It has been rewritten as an index over the per-component pages — which are
  generated from source doc-comments and so can't drift — plus the two things that had no home
  anywhere: the **theme system** (`themes` / `defaultTheme` / `themeTarget`, and how values blend)
  and the **JavaScript API**.
- **Getting Started put `direction="horizontal"` on the section** rather than the engine, and
  described nesting as "sections auto-detect their scroll parent" without mentioning follower mode.

- **GitHub Pages served a stale site with broken media** (`.glb` / `.mp4` / `.json` all 404). Pages
  was still configured for the pre-doc-system layout — source `main` @ `/` (repo root) — so it
  served the old hand-written root `index.html` and never exposed the generated `docs/`. Repointed
  Pages to `main` @ `/docs`, which the built site requires (it uses absolute `/…` asset paths, so
  `docs/` must be the web root). No code or asset was at fault.

Two months of accumulated work released off `v0.6.0`. No breaking API changes — the only
public-surface delta is additive.

### Added

- **`<tosi-scroll-map>`** (`TosiScrollMap` / `tosiScrollMap`) — declarative, waypoint-driven
  scroll controller for a tosijs-ui `<tosi-map>` (Mapbox). `<tosi-waypoint coords="lat,lng,zoom">`
  children become keyframes; latitude, longitude, and zoom interpolate independently as the
  section pins. `easing` attribute (default linear).
- **Cinematic README landing page** rendered by the doc-system — the full narrative authored as
  plain declarative HTML (raw-HTML-in-markdown, hydrated by the IIFE build).
- **Per-component doc pages** (e.g. `<tosi-interpolator>`) from `src/` doc-comment blocks and
  `src/docs/*.md`.

### Changed

- **Build pipeline now uses the `tosijs-ui/site` doc-system** (`bin/site.ts`), replacing the
  legacy standalone build (kept as `build:legacy`). Emits the static doc site to `docs/` plus
  the npm artefacts in `dist/` and `llms.txt`.
- **`tosijs-ui` peer bumped to `^1.6.19`** — picks up fully declarative media scenes, including
  `<tosi-3d>`, so the whole narrative is pure HTML with no JS orchestration.
- README samples render as static code; hero typography and prose column layout polished against
  the doc-system theme.

### Fixed

- Doc-system integration for the README hero engine.
- `tjs-lang` build coupling that broke the IIFE build after the tosijs-ui bump.
- Dropped a dead last-section exit-scroll code path.
