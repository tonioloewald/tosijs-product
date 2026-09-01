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
