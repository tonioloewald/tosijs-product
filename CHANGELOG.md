# Changelog

All notable changes to **tosijs-product** are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

For releases before 0.6.1, see the git history (`git log`) and tags.

## [Unreleased]

## [0.7.0] — 2026-09-01

Cut after this project's first pre-release review (`reviews/0.7.0-first-ever-review.md`), which
BLOCKed the candidate. Everything below the "Breaking" heading is a consequence of that report.

### Breaking

- **Peer floors raised: `tosijs ^1.7.5 → ^1.8.1`.** A required-peer floor raise is breaking for
  consumers — this is the change the major-minor bump names.
- **`tosijs-ui` is now an OPTIONAL peer** (`peerDependenciesMeta`), still floored at `^1.12.7`
  when present. The shipped ESM never imports it: `dist/module.js`'s only external import is
  `tosijs`, and the single `import "tosijs-ui"` lives in `src/index-iife.ts`, which is bundled.
  As a hard peer it forced every ESM consumer onto a five-minor-line upgrade plus twelve
  `@codemirror/*` transitives for a package they never load. It stays declared because
  `<tosi-scroll-map>` and the b3d controllers do target tosijs-ui elements — they `querySelector`
  for `<tosi-map>` / `<tosi-3d>` rather than importing them — so the pairing is real at app level
  even though it is not an import. **If you use those components, keep tosijs-ui installed.**
- **No module condition resolves to the IIFE any more.** `main` and the `browser` export
  condition both pointed at `dist/index.js`, which is an IIFE with no exports — so a
  browser-condition bundler or a legacy resolver got 5.4MB of dead weight and no exports.
  `main`, `import` and `default` now all resolve to `dist/module.js`. The IIFE is still
  published and still reachable by explicit path (`tosijs-product/iife`,
  `tosijs-product/dist/index.js`, or any CDN URL), which is the only way anything reached it
  deliberately. Measured before changing this: 3 jsDelivr hits and 86 npm downloads in the last
  month, all on 0.6.5.

### Added

- **The doc site declares `layout: "full-width"`** (new in `tosijs-ui@1.12.2`) on the README
  landing page and on every component page that carries a demo. The hero and the demo panels are
  now genuinely full-bleed instead of forcing their way out of the 44em reading column with
  `max-width`/`padding` `!important` overrides, and prose keeps its measure. Component demos went
  from a 704px panel to the full window width.
- **`haltijaDev: true` in the site config.** The dev server injects a localhost-gated haltija
  loader into served HTML, so an agent can drive https://localhost:8788 directly. Dev only —
  never bundled, never in `docs/`.

### Changed

- **`tosi-mosaic` gained `--format webp|jpg|png`** (default `webp`). `<tosi-filmstrip>` has
  always parsed all three out of the `_COLSxROWS_TOTAL.ext` filename; plenty of ffmpeg builds
  ship without a webp encoder, and there was no way out. Its prerequisites (`ffmpeg` +
  `ffprobe`) are now stated in the README and the component docs rather than only in
  `CLAUDE.md`, which the tarball excludes.
- **PrismJS is pinned to `1.30.0`** instead of a floating `@1`, so jsDelivr cannot change the
  highlighter under a page with no change on our side. No SRI: `loadPrism([...])` builds a URL
  per language on demand, so hashes need a build-time manifest that fails *closed* if it is
  stale — a design change, not a one-liner, and tracked rather than half-done. The runtime CDN
  dependency is now documented for CSP-strict consumers.
- **The `marked` devDependency now matches upstream's range** (`^16 || ^17 || ^18`). It stays —
  it is a required, non-optional peer of `tosijs-ui` — but ours was narrower than what upstream
  accepts.
- **Both bundles are minified, and everything got smaller.** Measured against the **published
  0.6.5 tarball**, from a clean `bun install --frozen-lockfile` (see below — this matters):

  | | 0.6.5 published | 0.7.0 | |
  |---|---|---|---|
  | `dist/index.js` (CDN IIFE) | 2.76MB raw / 651kB gzip | 1.84MB raw / **578kB gzip** | −11% gzip |
  | `dist/module.js` (what you `import`) | 37.1kB raw / 9.1kB gzip | 21.7kB raw / **7.3kB gzip** | −19% gzip |
  | packed tarball | 668kB | **603kB** | −10% |

  The IIFE is still dominated by the tosijs-ui barrel, which statically reaches CodeMirror: the
  same bundle built without tosijs-ui is 138kB raw / 47.9kB gzip, so **the barrel is 92% of the
  gzipped payload**. Filed upstream with these numbers
  ([tosijs-ui#120](https://github.com/tonioloewald/tosijs-ui/issues/120)); tracked in `TODO.md`.
- **Release artifacts are now built from a clean dependency install.** An incrementally-mutated
  `node_modules` — the normal result of a few `bun add` / `bun remove` cycles — left **nested
  duplicate `@codemirror` copies** under six sibling packages, which the IIFE then bundled once
  each. Same lockfile, same `tosijs-ui@1.12.7`, but the bundle came out **625kB larger** than a
  clean install of the same lockfile produced, and nothing in the build said so. Caught while
  checking the numbers for the table above, which is why they read the way they do rather than
  claiming a 19% regression. `rm -rf node_modules && bun install --frozen-lockfile` before
  building anything you intend to publish; the build is byte-reproducible from there.

- **Peers moved to the `tosijs-ui` 1.12 line: `tosijs@^1.8.1`, `tosijs-ui@^1.12.7`** (from
  `^1.7.5` / `^1.7.1`), with `tjs-lang` bumped to `^0.13.6` to match. Consumers must upgrade both
  peers. Two build-visible consequences: `dist/` is now **only** the four published artefacts —
  the doc-site hydration bundle and `dist/iife.js` that 1.7 leaked in there (the cause of the 0.6.5
  tarball bloat) are gone by construction — and a concurrent `bun run build` while the dev server
  is running is now refused by a build lock rather than racing it to `rm -rf docs/`.
- **`chokidar` added as a devDependency.** It became an optional peer of `tosijs-ui`; without it
  the dev server refuses to start.

### Fixed

- **`<tosi-interpolator>` could not interpolate hex colors.** `interpolateStrings` tested for
  numbers before colors, and a hex color is a digit-bearing string — so it was read as a decimal.
  Three distinct failures, all now covered by regression tests: `#a0b0c0`→`#d0e0f0` **never
  animated at all** (both scan as `0,0,0`, so every frame interpolated 0→0); `#290000`→`#310000`
  blended through `#300000` instead of `#2d0000`; and `#100000`→`#100001` emitted the invalid
  literal `#100000.5`, which browsers drop, flashing the element to its unstyled value. The
  theme system's copy of the same kernel had been fixed and the interpolator's had not — **the
  two copies are now one function** in `src/waypoints.ts`, exported under both existing names so
  they cannot drift again. Existing demos escaped this only because their colors happened to
  fall through to the color branch.
- **Five of seven type declarations were missing from the published tarball.** `dist/index.d.ts`
  re-exports seven modules; the build flattened only `index.d.ts` and `tosi-product.d.ts` out of
  `dist/src/` and deleted the rest, and `files` listed only those two. Confirmed against the
  published 0.6.5 tarball. Any TypeScript consumer importing `tosiFilmstrip`, `tosiInterpolator`,
  `tosiScrollMap`, `tosiPrism`, the b3d controllers, or the waypoint helpers got an unresolved
  module. Present since 0.6.4. Verified fixed by typechecking a real consumer against the packed
  tarball.
- **`<tosi-product debug>` did nothing.** The overlay tested
  `getAttribute("debug") === "true"`, so the boolean form its own documentation shows set the
  property and left the overlay hidden. It now reads the `initAttributes`-backed `this.debug`,
  which follows the standard presence-is-true rule; `debug="true"` still works. `debug` is also
  in the MutationObserver's `attributeFilter` now, so it can be toggled live like `scroll`.
- **`threshold="0"` and `to="0"` were read as missing.** `Number(attr) || default` cannot tell
  an explicit zero from an absent attribute, so `<tosi-product-header threshold="0">` (pin from
  the very top) got 50, and `<tosi-scroll-time to="0">` (midnight) got 24. Both now fall back
  only on a missing or unparseable value.
- **A malformed `data-scroll-range` froze the animator silently.** `data-scroll-range="0.5"` —
  a missing comma — produced NaN, which survives the clamp and every step downstream, so the
  element stuck at its first waypoint with nothing logged. It now falls back to the full range
  and warns once, naming the attribute. A trailing comma (`"0.5,"`) was worse than NaN and is
  also fixed: `Number("")` is 0, so it parsed as a backwards range that pinned the animator at
  1 while looking perfectly valid.
- **`tosi-mosaic` exited 0 when ffmpeg failed**, so `tosi-mosaic in.mp4 && deploy` shipped a
  broken or missing filmstrip. It exits 1 now, and prints ffmpeg's own stderr instead of
  `Failed with exit code 8` — which is how "your ffmpeg has no webp encoder" used to reach you.
  Three more defects in the same file: `--fps` was parsed and never used; the frame-selection
  divisor was interpolated into the ffmpeg filter as `floor((${nb_frames}||1)/${total})`, which
  is not a valid expression when `nb_frames` is `N/A` (mkv, webm, any unindexed stream) and
  divides by zero when the source has fewer frames than requested. The divisor is computed in
  JS now, clamped to ≥ 1, from `nb_frames` → `duration × fps` → an actual frame count as a last
  resort. A file that reported neither used to fail with advice (`pass --fps`) that could not
  help when duration was the missing half; it now works.
- **Two waypoints sharing a `progress` froze the animator.** The span division was 0/0; the NaN
  propagated into every style the pair drove, with no error anywhere. `rangeT` now resolves a
  zero-width span to its far end, and is exported and tested.

- **The hero's title collided with its tagline.** `scale(1.4)` on the `<h1>` costs no layout
  space, so once the intro scenes were sized to their content there was nothing to absorb the
  overshoot. The h1's bottom margin now reserves it, and the paired shift is font-relative so the
  reservation holds at every `clamp()` size.
- **Restored reading measures were `44em` on elements with their own font-size**, so an `<h1>` at
  2× body text got an 88em measure and an `<h2>` 66em — visibly wider than the paragraphs between
  them. They are `44rem` now, which matches the doc-system's own measure exactly.
- **`<tosi-filmstrip>` letterboxed in a full-bleed scene.** Its canvas is `object-fit: contain`;
  the README hero now asks for `cover` through the component's existing `::part(canvas)`, so a
  16:9 mosaic fills a full-viewport scene instead of sitting in black bars. The `<tosi-filmstrip>`
  doc page's own panel is `aspect-ratio: 16/9` for the same reason.
- **Seven `html` code fences rendered as empty 320px preview boxes.** The doc-system upgrades
  every `html` fence into a live `<tosi-example>`, and these were fragments — a `<script src>`, a
  `<tosi-product-section>` outside any `<tosi-product>`, blocks containing literal `…` — that
  cannot run and rendered nothing, hiding the code behind a tab. They are `markup` fences now and
  render as code. The one complete, runnable example on that page stays live.

## [0.6.5] — 2026-07-27

### Fixed

- **Published tarball was 13.7MB and shipped doc-site internals.** `files` was `["dist", "bin", …]`,
  which globbed *everything* in those dirs — and the tosijs-ui 1.7 build drops a full doc-site
  hydration bundle into `dist/hydrate/` (including a 161KB CodeMirror editor and a 4.19MB
  `dist/iife.js.map`), plus `bin/site.ts` (the doc build entry, not a consumer CLI). None of it is
  referenced by the package `exports`. Replaced the glob with an explicit allowlist
  (`dist/index.js`, `dist/module.js`, the two `.d.ts`, `bin/tosi-mosaic.ts`, README, LICENSE):
  **13.7MB → 2.8MB unpacked, 27 files → 8.** First shipped in 0.6.4; consumers on 0.6.4 should
  upgrade. (The remaining size is `dist/index.js`; trimming that CDN IIFE is tracked in `TODO.md`.)

## [0.6.4] — 2026-07-27

Supersedes 0.6.3, which was tagged in git but never published to npm; this is the first
release on the tosijs-ui 1.7 line.

### Changed

- **Peers bumped to `tosijs ^1.7.5` and `tosijs-ui ^1.7.1`** (tjs-lang devDep → `^0.12.0`, which
  `tosijs-ui@1.7.1` requires). The reason to move: tosijs-ui 1.7 makes the **doc-system ship the
  code editor lazily** — a reader who never opens an editor downloads **zero** CodeMirror. Our
  doc-site hydration entry is now a module (`/hydrate.js`, ~130KB gzip) with the editor as a lazy
  chunk, down from the old flattened IIFE. No change to `tosijs-product`'s own API; verified
  end-to-end (all custom elements hydrate; the `<tosi-scroll-map>` flyover drives the full
  waypoint flight); 48/48 tests, typecheck, and build all green.

### ⚠️ Known regression (self-contained CDN build only)

- **`dist/index.js` (the IIFE for `<script src=…>` / CDN use) grew ~290KB → ~650KB gzip.** It does
  `import * as tosijsUi`, pulling tosijs-ui's whole barrel — which in 1.7 statically includes the
  CodeMirror editor — and an IIFE cannot code-split, so the lazy-editor win does **not** reach it.
  This affects **only** the self-contained CDN path. The **ESM build is unaffected** (`dist/module.js`
  ~9KB gzip, tosijs-ui `external`) — bundler consumers, the recommended path, pay nothing. Tracked
  in `TODO.md`: trim `src/index-iife.ts` to not drag the editor (or adopt an editor-free tosijs-ui
  barrel entry when one exists). **If you consume via CDN and size matters, prefer the ESM build
  until this is resolved.**

## [0.6.3] — 2026-07-15

### Changed

- **Peers bumped to `tosijs ^1.6.9` and `tosijs-ui ^1.6.23`** — both stability releases we now
  develop and test against. `tosijs-ui@1.6.23` is the dev-server safety release: its
  `killStrayServer` previously `kill -9`'d every process *connected to* the dev port (`lsof -i:PORT`
  matches remote-port sockets too), so `bun start` could SIGKILL the very browser rendering the
  page — including a haltija/Playwright head driving `localhost:8788`. It now signals only the
  listening JS runtime, SIGTERM first. It also adds an 8-hour idle timeout (`idleTimeoutHours: 0`
  to disable) and an out-of-memory preflight (`DEV_SKIP_PREFLIGHT=1` to skip). `tosijs@1.6.9`
  carries the `parts`-proxy fix (tosijs#13). No API change here; build/typecheck/tests unchanged
  and green.

  **On bundle size:** this bump adds essentially nothing (library `dist/index.js` +165 bytes
  gzip → ~290KB; doc-site `docs/iife.js` +111 bytes → ~122KB). Note that number is *small because
  the cost was already paid at our previous floor* — tosijs-ui moved its editor from ACE to
  CodeMirror around 1.6.21, below our 0.6.2 `^1.6.22` pin, so 0.6.2 already carried it. It is **not**
  that the editor doesn't reach us: `src/index-iife.ts` does `import * as tosijsUi`, so the library
  IIFE bundles the whole barrel (editor included), and the doc-site live-examples pull CodeMirror via
  the lazily-served `/tjs/` chunk (`docs/tjs/tjs-browser.js`, ~327KB raw). A forthcoming tosijs-ui
  release makes doc pages ship **zero** CodeMirror unless a reader actually opens an editor, dropping
  bundle size back toward pre-ACE levels — a win we inherit on the next peer bump, no work here.

### Fixed

- Doc-comment for `<tosi-prism>` called tosijs-ui's `<tosi-code>` "ace-based"; it is CodeMirror-based
  as of the 1.7 line. Dropped the stale editor name.

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
