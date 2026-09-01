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
- **`rgb()` and `hsl()` waypoint values now blend through `color-mix()`.** Unifying the
  interpolator on the theme kernel put the color test above the numeric branch, so these join
  hex and named colors instead of interpolating per channel:
  `interpolateStrings("rgb(0,0,0)", "rgb(255,255,255)", 0.5)` was `rgb(127.5, 127.5, 127.5)`
  and is now `color-mix(in srgb, rgb(0,0,0) 50%, rgb(255,255,255))`. This is the consistent
  behaviour and it fixes hsl, where per-channel interpolation takes the long way round the hue
  wheel — but it raises a floor: **`color-mix()` is Baseline mid-2023** (Chrome 111, Safari
  16.2, Firefox 113). On anything older the declaration is dropped and the element flashes to
  its unstyled value, which is the same failure this release fixes for hex. If you must support
  older engines, interpolate a custom property yourself and compose the color in CSS. The
  endpoints are returned verbatim, so `t=0` and `t=1` never need `color-mix` support.
- **`isColor` and `interpolateThemeValue` are no longer declared in
  `dist/tosi-product.d.ts`** — they moved to `dist/waypoints.d.ts` with the kernel. The package
  barrel is unchanged, so `import { isColor } from "tosijs-product"` still works and is the
  supported form. Only a *type-only deep import* of `tosijs-product/dist/tosi-product` breaks;
  switch it to the barrel, or to `tosijs-product/dist/waypoints`. (0.6.5 shipped only two
  declaration files, which made that deep path more plausible than it should have been — see
  the tarball fix below.)
- **No module condition resolves to the IIFE any more.** `main` and the `browser` export
  condition both pointed at `dist/index.js`, which is an IIFE with no exports — so a
  browser-condition bundler or a legacy resolver got 5.4MB of dead weight and no exports.
  `main`, `import` and `default` now all resolve to `dist/module.js`. The IIFE is still
  published and still reachable by explicit path (`tosijs-product/iife`,
  `tosijs-product/dist/index.js`, or any CDN URL), which is the only way anything reached it
  deliberately. Measured before changing this: 3 jsDelivr hits and 86 npm downloads in the last
  month, all on 0.6.5.

### Added

- **The doc site declares a page `layout`** (new in `tosijs-ui@1.12.2`). The README landing page
  uses **`full-screen`** — no reading column, no gutter and no nav column, so the cinematic hero
  gets the whole window, with a hamburger that brings the nav back and keeps it offered. Every
  component page that carries a demo uses **`full-width`**, which drops the measure but keeps
  the nav, since those are prose pages with one full-bleed band in the middle. The hero and the demo panels are
  now genuinely full-bleed instead of forcing their way out of the 44em reading column with
  `max-width`/`padding` `!important` overrides, and prose keeps its measure. Component demos went
  from a 704px panel to the full window width.
- **`haltijaDev: true` in the site config.** The dev server injects a localhost-gated haltija
  loader into served HTML, so an agent can drive https://localhost:8788 directly. Dev only —
  never bundled, never in `docs/`.

### Changed

- **`tosi-mosaic --format jpg|png` was emitting worst-possible output.** `--quality` is a 0–100
  scale and only webp reads it that way: mjpeg's `-q:v` is a 1–31 *qscale* where lower is
  better and anything past 31 clamps, so `-q 75` (the default) and `-q 90` produced
  byte-identical, maximally-compressed JPEGs — and PNG ignores `-q:v` entirely. Quality is now
  mapped per encoder, verified monotonic (q30/75/95 → 1.9MB/3.4MB/6.6MB). The escape hatch
  added earlier in this release shipped broken; the pre-release review caught it.
- **`tosi-mosaic` truncated the mosaic to the front of the clip.** The grid was sized from the
  *requested* frame count while `select` emitted a different number, so a 192-frame source at
  `-f 60` built an 8×8 grid, filled 64 tiles, dropped the rest — and wrote `_60` in the
  filename, so `<tosi-filmstrip>` scrubbed a subset and called it the whole video. The grid is
  now derived from what `select` actually emits; the count lands on a multiple of the stride
  and says so.
- **The README hero's scale-and-shift did not shift.** `interpolateStrings` substitutes numbers
  and keeps the *from* value's unit text, so the `translateY(0px)` → `translateY(0.2em)` pair
  introduced earlier in this release animated 0 → 0.2 **px** for the whole pin and then snapped
  ~19px on the single frame where the `t >= 1` early-out returns the raw *to* value. Both ends
  are `em` now. The claim that the reservation was "font-relative at every clamp size" was true
  for exactly one frame.
- **The PrismJS allowlist leaked through `Object.prototype`, and SRI failed open.**
  `LANGUAGE_DEPS[lang]` was guarded by a truthiness test, so `constructor`, `toString`,
  `valueOf` and `__proto__` all inherited truthy values and passed — and since none is in the
  integrity table, the one path to an unlisted URL was also the one path that skipped the hash.
  The guard is `Object.hasOwn` now and a missing hash is a **refusal**, not a plain load.
- **A failed Prism load latched forever.** The promise cache is there to dedupe concurrent
  loads, but it also cached *rejections* — and the new timeout makes those reachable — so one
  transient failure disabled highlighting for the life of the page, every retry replaying the
  old error. Failures are now forgotten so a later call can try again.
- **The demo mosaic covered half its video.** `agent-owl_10x10_100.jpg` was generated by the
  broken `tosi-mosaic` and never regenerated: 100 frames of a 192-frame clip, while the
  filename and `total="100"` claimed the whole thing — so the README's filmstrip scene ended
  halfway while the `currentTime` scene right before it played to the end. Regenerated as
  `agent-owl_10x10_96.jpg` (stride 2, all 192 frames represented, same 6400×3600 grid);
  verified by SSIM that the last tile is source frame 190 rather than 99. It is also **32%
  smaller** — 4.89MB → 3.35MB. **If you generated a mosaic with an earlier `tosi-mosaic`,
  regenerate it**: the code fix does not reach assets already on disk.
- **`tosi-mosaic --format png` ran `--quality` backwards.** PNG is lossless, so the flag has no
  fidelity meaning there, but it was mapped to `-compression_level` inverted — `-q 100` gave
  the *largest* file for byte-identical pixels, against a help text saying higher is better.
  `--quality` is now ignored for png and the help says so.
- **PrismJS loads are now integrity-checked**, and the rationale for not doing it was wrong.
  The earlier note claimed an open-ended URL set needing a build-time manifest; in fact
  `visit()` returns early for any language outside a closed seven-entry map, so the reachable
  set is core + 7 grammars + 1 theme = **nine fixed URLs at a pinned version**. All nine now
  carry `integrity` + `crossorigin`, verified against the live CDN and in a browser.
  `LANGUAGE_DEPS` is documented as the security boundary it is, since widening it widens the
  URL set.
- **`loadPrism()` could hang forever.** `loadTheme()` attached only `onload` — no `onerror`, no
  timeout — so under a strict CSP (exactly the consumer the CDN note addresses), offline, or a
  CDN outage, the first `await` never returned and the documented two-line usage silently
  stopped at line one. The theme now resolves on failure (missing colors, not missing
  function); grammars still reject; both are bounded by a timeout.
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
- **`buildLibrary()` cleans `dist/` first**, and `prepublishOnly` runs typecheck + tests +
  build. `files` ships `dist/*.d.ts` as a glob over a directory nothing cleaned, so a
  declaration for a deleted module would have been swept into the tarball — this repo has
  already renamed `tosi-code.ts` → `tosi-prism.ts` once. Latent, not live, and now impossible.
- **The documented CDN URLs are pinned to `@0.7.0`.** `README.md` and `getting-started.md` both
  told consumers to load an unversioned jsDelivr URL — the exact hazard this release pinned
  PrismJS to avoid, one layer out. Pages on that URL would have swapped builds with nobody
  deploying anything.
- **`haltija` added as a devDependency.** `haltijaDev: true` spawns a channel on every
  `bun run start`; with no devDependency the resolver falls through to `bunx haltija@^1.12.6`,
  which caches per range-string and pins you to whatever it first resolved.
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
- **`isColor` matched any value that merely *started* with a color**, so `<tosi-interpolator>`
  wrapped whole shorthand values in `color-mix()`. A `box-shadow` waypoint pair
  (`rgb(0,0,0) 0 0 10px` → `rgb(0,0,0) 0 0 20px`) produced
  `color-mix(in srgb, rgb(0,0,0) 0 0 10px 50%, …)` — not a color, not valid CSS — so the
  shadow vanished for the whole pin interior and reappeared at the endpoints. Every property
  whose value begins with a color and continues was affected: `box-shadow`, `text-shadow`,
  `border`, `outline`, `background`. It now requires the value to be *entirely* a color, with
  the function's opening paren closed by the last character. `oklab`/`oklch`/`lab`/`lch`/`hwb`
  are recognised too.
- **`<tosi-product debug>` did nothing.** The overlay tested
  `getAttribute("debug") === "true"`, so the boolean form its own documentation shows set the
  property and left the overlay hidden. It now reads the `initAttributes`-backed `this.debug`,
  which follows the standard presence-is-true rule; `debug="true"` still works. `debug` is also
  in the MutationObserver's `attributeFilter` now, so it can be toggled live like `scroll`.
- **`threshold="0"` and `to="0"` were read as missing.** `Number(attr) || default` cannot tell
  an explicit zero from an absent attribute, so `<tosi-product-header threshold="0">` (pin from
  the very top) got 50, and `<tosi-scroll-time to="0">` (midnight) got 24. Both now route
  through one exported helper, `numAttr(attr, fallback)`, rather than an idiom each caller
  re-derives — because the obvious repair is worse than the bug and this release very nearly
  shipped it: `Number.isFinite(Number(attr)) ? … : fallback` looks right, but `getAttribute`
  returns `null` for an absent attribute, `Number(null)` is `0`, and `0` is finite, so the
  fallback becomes unreachable and *every* default collapses to zero. That version was caught
  by the pre-release review, not by the test suite, which is why `numAttr` now has tests
  asserting both directions.
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
