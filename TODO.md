# TODO

Follow-ups filed during releases (per the shared review/releasing practices). Newest first.

## From the 0.7.0 pre-release review (`reviews/0.7.0-first-ever-review.md`)

**Filed:** 0.7.0 (2026-09-01). Items routed to this repo by the review's follow-up section.
Everything marked **(unverified)** was reported by a lens but not adversarially verified —
sanity-check before fixing. The report's blockers, M1, M2 and M3 were fixed in 0.7.0 and are
not repeated here.

### M4 — the engine re-derives its whole animation model every frame
**Severity:** efficiency (confirmed by the review). Every rAF notifies every section (even when
clamped at 0/1), and each animator re-runs `querySelectorAll`, re-reads inline styles into fresh
objects, re-sorts waypoints, and re-walks ancestors for its scene/map. `map.coords` and video
`currentTime` are written even while clamped. This contradicts the README's "high-performance"
claim and the allocation churn lands as GC jank on exactly the low-end mobile audience the
library targets. **Two stages:** (1) skip `_notify` when a section's progress is unchanged, and
skip clamped-endpoint writes; (2) cache the parsed animator/waypoint model, invalidated by the
MutationObserver `TosiProduct` already owns. Folding in: `_applyTheme` rewrites every theme
custom property per frame (cache last value per key, early-return on unchanged from/to/t), and
`<tosi-filmstrip>` re-parses its grid from `src` and re-blits the full frame even when the frame
index has not moved.

### Fixed in 0.7.0 — reproduced first, regression-tested where testable
`debug` boolean attribute (+ live toggling); `threshold="0"` / `to="0"` swallowed by
`Number(attr) || default`; `rangeProgress` NaN on a malformed `data-scroll-range`, and the worse
trailing-comma case that parsed as a backwards range; every `bin/tosi-mosaic.ts` defect — exit 0
on failure, dead `--fps`, the `nb_frames=N/A` invalid expression, the mod-by-zero — plus a
`--format` escape hatch and stderr that actually reaches the user. PrismJS pinned to an exact
version; `marked` range aligned with upstream. See CHANGELOG 0.7.0.

### From the 0.7.0 remediation re-review (`reviews/0.7.0-remediation-re-review.md`, 2026-09-01)

Blockers (B1 `threshold` default, B2 undocumented breaking changes) were fixed before tagging.
Also fixed from that report: the mosaic quality mapping and grid truncation, the README hero's
unit mismatch, PrismJS SRI (the earlier "needs a manifest" rationale was wrong — the set is nine
fixed URLs), `loadPrism()` hanging on a failed theme load, the CDN pins in the docs, the haltija
devDependency, `rm -rf dist` + `prepublishOnly`, and the capped `warnedRanges`. What is left:

- [ ] **Harden `interpolateStrings` against silent unit drops.** It substitutes numbers and keeps
      the *from* value's unit text, so a `0px → 0.2em` waypoint pair animates in px and snaps on
      the last frame — which is exactly the bug that shipped in the README hero this release.
      Compare the non-numeric segments between number runs and step at the midpoint when they
      differ, the way non-matching values already do, so the slip is visible instead of silent.
- [ ] **Dev-server watch rebuilds re-run `buildLibrary()` on every save** (`bin/site.ts`),
      calling `Bun.build()` in-process — the arena-retention pattern CLAUDE.md already documents
      and that tosijs-ui fixed on its own side by moving to a child process. Reported at 12MB →
      372MB RSS over 25 rebuilds; **sanity-check that measurement first.** `buildLibrary()` only
      writes `dist/`, which the dev server never serves, so the watch hook can be
      `{ build: () => buildSite(siteConfig) }` with `buildAll` kept for the initial/`--build`
      path.
- [ ] **Cut the IIFE with tosijs-ui's per-component subpaths.** `tosijs-ui/babylon-3d`,
      `/mapbox`, `/bodymovin-player` exist in 1.12.7; a drop-in build using them is reported at
      72kB gzip against 578kB, still covering every element the docs use declaratively. This
      unblocks the tracked option 2 below and answers its open question. **Re-measure before
      committing to the number**, and land it as a named breaking change — it narrows the
      `globalThis.tosijsUi` surface.
- [ ] **`<tosi-filmstrip>` downloads its whole mosaic in `connectedCallback`.** Four scenes at
      the documented `--frames 100 --width 1280` recipe start four multi-MB downloads at page
      load. Gate on `IntersectionObserver` or defer to the first `setScrollProgress`, with a
      `loading="eager"` escape hatch.
- [ ] **The landing page is ~18MB of media on first load.** `/agent-owl.mp4` is 10.3MB with
      `preload="auto"`, `/agent-owl_10x10_100.jpg` is 4.9MB fetched eagerly — the same 100 frames
      downloaded twice by design — plus a 2.5MB glb. Cheapest first: `preload="metadata"`,
      regenerate the mosaic smaller (tiles are only 640×360), trim the clip. This is the page
      adopters copy.
- [ ] **`docs/iife.js` (1.32MB) is committed and served but referenced by nothing** — grepping
      `docs/` finds no built HTML that loads it. Confirm against the dev server, then stop
      emitting it or `rm` it in `buildLibrary()`. If `buildSite` emits it unconditionally, that
      is an UPSTREAM entry instead.
- [ ] **Six copies of the reading-measure CSS** (`src/tosi-*.ts` doc blocks + `README.md`). All
      consistent today, but the `44em → 44rem` fix had to be applied to every one in the same
      commit, and CLAUDE.md now carries a rule whose only job is to stop copy seven. Hoist to one
      stylesheet under `demo/assets/` or a shared string in `demo/site.ts`. The upstream half is
      filed in `UPSTREAM.md`.
- [ ] **`tosi-prism` has no tests, and `LANGUAGE_DEPS` is now load-bearing.** It is the allowlist
      that keeps the SRI URL set closed; the obvious feature request ("support any Prism
      language") deletes the guard in one line with every test still green, because there are
      none. Add two: the exact URL set for `['javascript']`, and that `['../../evil/x']` loads
      nothing.
- [ ] **`marked` was widened to `^16 || ^17 || ^18` with only one version ever resolved.**
      Asserted-safe, never built against 17 or 18. Test-build against the range ends or narrow
      it back.
- [ ] **Coverage debt on the tosijs-ui 1.7 → 1.12 jump.** `<tosi-scroll-map>` and the three b3d
      controllers reach into tosijs-ui elements by `querySelector` (`tosi-map`, `tosi-3d`,
      `tosi-b3d-skybox`) rather than by import, so a renamed element or changed DOM shape fails
      silently at runtime with no build or type signal. Five minor lines were crossed and only
      the doc-site demos exercise that coupling.
- [ ] **`<tosi-product>` internals have no test seam.** `debug` and `threshold` are both
      untestable under the current harness (appending a `<tosi-product>` hangs `bun test`), and
      B1 is the proof it matters — the untested half of that pair is the one that broke.
      Extract the decisions into pure exported functions, the way ownership and interpolation
      already are.
- [ ] **Decide whether `docs/**.map` should ship at all.** `docs/iife.js.map` is 4.6MB and
      `hydrate.js.map` 1.9MB, both served by GitHub Pages. They also carry haltija source text
      (from tosijs-ui's own `haltijaDev` implementation — no token, no endpoint, and the emitted
      JS is clean), which is the only wrinkle in this release's "never in `docs/`" claim.

### Still open — deferred deliberately, with the reason

- [ ] **`TosiProductHeader` only listens to window scroll.** It never appears inside an
      inner-scroll-container embed — the case `getScrollParent` exists for — and checks the wrong
      axis on a horizontal engine. Deferred from 0.7.0 because the fix changes when the header
      appears on every existing page, and the embed case has no test to catch a regression. Do it
      with `getScrollParent` (which already falls back to `window`) **and** a test for the
      embedded case.
- [ ] **SRI for the PrismJS CDN loads.** `loadPrism([...])` builds a URL per language on demand,
      so integrity hashes need a build-time manifest covering every language a caller might
      request. A stale or missing entry fails *closed* — highlighting silently stops — so this is
      a design change, not a hardening one-liner. Pinning the exact version in 0.7.0 removed the
      "jsDelivr served something new" half of the risk.
- [ ] **Migrate all 10 elements off `elementCreator({ tag })` to `static preferredTagName`.**
      The API is deprecated upstream and this is the migration's only in-suite signal (10 warnings
      at test time). Deferred because it changes custom-element registration for every component
      at once — the highest-risk item on this list, and it wants its own change and its own
      review rather than riding along in a release remediation.

### Accepted risk (owner decision, not open work)
- **Unrestricted public Mapbox token** (`src/tosi-scroll-map.ts`, `README.md`, deployed `docs/`).
  Confirmed by the review: the API returns 200 with a spoofed referer, so any origin can bill
  tiles to the account. **The owner accepted this on 2026-09-01** — it is a public token, which is
  designed to be client-visible, and the demo needs a live one. Restricting it to
  `product.tosijs.net` in the Mapbox dashboard stays the cheap mitigation if that changes.


### Test coverage
- [ ] Four of six component families have no tests: `tosi-prism`, `tosi-filmstrip`,
      `tosi-b3d-scroll` (3 elements, including the `querySelector('tosi-b3d-skybox')` coupling),
      `tosi-scroll-map`. The 53 green tests cover `tosi-product`'s pure seams, theming, and
      interpolation/waypoints only.
- [ ] No tests for `bin/tosi-mosaic.ts`, the package's only shipped CLI.
      elements (migrate to `static preferredTagName`). It is the migration's only in-suite signal.

### Not ours — file upstream on tosijs-ui, then mirror in `UPSTREAM.md`
- [ ] **(unverified)** Stale build lock double-failure in `tosijs-ui/site`'s `buildSite`: a run
      that refuses because of a dead pid re-stamps the lock with its own pid, so one crashed build
      poisons the next **two** (observed: pids 14917 → 15010 → success). When the lock's pid is
      dead, take the lock and proceed.
- [ ] Sweep tosijs-ui's open incoming issues for anything the 1.7→1.12 migration should close or
      should have addressed — no lens did this.


## Why does the doc-site bundle land in `dist/hydrate/`?

**Filed:** 0.6.5 (2026-07-27). **Severity:** hygiene (npm side fixed by the `files` allowlist).

The tosijs-ui 1.7 build writes a full doc-site hydration bundle (`hydrate.js`, `code-editor-cm`,
`site-*`, sourcemaps) into `dist/hydrate/` — doc-site output that belongs in `docs/`, not `dist/`
(the npm-publish dir). The 0.6.5 `files` allowlist stops it reaching the tarball, but it still
bloats the git tree and is confusing. Find where it's configured (our `bin/site.ts` /
`tosijs-product-site.config.ts`, or a tosijs-ui/site default in 1.7) and point it at `docs/`, or
`rm -rf dist/hydrate` in `buildLibrary()` alongside the existing `dist/src`/`dist/demo` cleanup. If
it's a tosijs-ui/site default, file upstream.

## Trim the self-contained IIFE so it doesn't bundle the CodeMirror editor

**Filed:** 0.6.4 (2026-07-27). **Severity:** efficiency (not a correctness regression).

`dist/index.js` (the CDN `<script src>` build, from `src/index-iife.ts`) jumped ~290KB → ~650KB
gzip on the tosijs-ui 1.7 bump, because it does `import * as tosijsUi` — the whole barrel, which
in 1.7 statically pulls CodeMirror — and an IIFE can't code-split, so the editor is inlined. The
ESM build (`dist/module.js`, tosijs-ui `external`) is unaffected (~9KB). We ship the editor to CDN
consumers who never use it.

**Options:**
1. Import only the tosijs-ui components the declarative demos actually need (map, 3D, lottie, …)
   into `src/index-iife.ts` instead of `import * as tosijsUi`, and assemble `globalThis.tosijsUi`
   from those — but verify no declarative page relies on a component we drop.
2. Use an editor-free tosijs-ui barrel entry if 1.7 exposes one (it has `./code-editor` /
   `./live-example` subpaths; check whether `.` can be imported without them). If not, **file
   upstream** (request a barrel entry that omits the editor) and mirror in `UPSTREAM.md`.

**Done when:** `dist/index.js` is back near its pre-1.7 gzip size with no loss of declarative
capability, verified on the live doc site.
