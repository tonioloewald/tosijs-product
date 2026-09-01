# Upstream notes (tosijs-ui)

Things we found while adopting `tosijs-ui/site` in `tosijs-product` that
seem worth raising in tosijs-ui (or in tosijs / the broader ecosystem)
rather than working around locally. Add new entries at the top with a
short context block and a concrete suggestion.

> **This file is a local mirror, not the channel.** Per
> [cross-project.md](https://github.com/tonioloewald/tosijs-coding-practices/blob/main/practices/cross-project.md)
> ("file, don't fix"), the **GitHub issue on the target repo** is how we actually tell
> tosijs-ui something — this file just keeps the context where we work. **An entry here
> without a filed issue is a complaint nobody will ever read.** So: file the issue, link it
> here, and mark `✅ RESOLVED (fixed in <pkg>@<version>)` + close the issue when it lands.
>
> All open entries below were filed as issues on 2026-07-12.

## Strategic — `tosijs-product` as a first-class integration target

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/9

`tosi-product`, `tosi-product-section`, `tosi-product-header`,
`tosi-interpolator`, `tosi-waypoint`, `tosi-filmstrip` are exactly the
primitives a doc site needs to make its landing / README page cinematic
without inventing one-off scroll choreography. The product engine
detects the doc-browser's scroll container, pins inside it, and re-themes
the rest of the page via `:root` CSS variables — so any consumer who
already runs `tosijs-ui/site` can drop these into a `.md` file's
` ```html ` block and get an Apple-style narrative landing for free.

**Suggestion:** once we've shipped this README/landing, document the
pattern in `doc-site-system.md` ("Cinematic landing pages with
tosijs-product") with a minimal example. Possibly: declare `tosijs-product`
as a recommended optional peer of `tosijs-ui` for sites that want the
narrative-landing capability.

---

<!-- Add findings below as we go. Format:

## <Short title>
**Context.** What we ran into / where in tosijs-ui.
**Suggestion.** Concrete tweak we'd propose.

-->

## Dev-server source-write endpoint authorizes on peer address alone (drive-by file write)

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/121 (filed 2026-09-01, `tosijs-ui@1.12.7`)

**Context.** `POST /__docstore/source` — the endpoint `editableSources: true` turns on here —
gates only on `isLoopbackAddressForAuth(peer)`, with no Origin or `Sec-Fetch-Site` check, on a
server that binds all interfaces. `await request.json()` ignores Content-Type, so a
CORS-safelisted `text/plain` simple request needs no preflight; containment is `resolveInRepo`,
which includes `bunfig.toml`, `bin/site.ts`, `package.json` scripts and `.git/hooks/*`. So any
page visited while `bun run start` is running can write files that execute on the next ordinary
command. The code's own comments claim SameSite covers this — true of the tunnel path, which
requires a cookie; the direct path consults no session at all. Pre-existing and dev-machine only,
but `haltijaDev` put a second capability behind the same check (`mayDriveWithAgent` delegates to
`mayWriteSource`), and Firefox and Safari do not implement PNA.

**Suggestion.** Require `Sec-Fetch-Site: same-origin` (or a matching Origin) on the direct path
in addition to the loopback test. A browser cannot forge either.

**Interim, here:** don't leave `bun run start` running while browsing untrusted sites, or set
`editableSources: false` when not editing page source.

---

## `layout: "full-width"` offers no way to put the reading measure back

**Filed with:** the [#119](https://github.com/tonioloewald/tosijs-ui/issues/119) write-up (the
other half of the same gap)

**Context.** `full-width` drops the reading column and supplies nothing to restore it on the
children that still want it, so every adopter hand-rolls
`.doc-content:has(.X) > :not(.X):not(style){max-width:44rem;margin-inline:auto;…}` once per page.
This repo now carries **six** copies of that block, all of which had to be edited together when
the `44em → 44rem` bug was fixed (an `<h1>` at 2× body text got an 88em column), and `CLAUDE.md`
carries a hand-written rule whose only job is to stop copy number seven reintroducing it.

**Suggestion.** A class, or a `--doc-content-max-width` that children can opt back into.

---

## The `tosijs-ui` barrel puts CodeMirror in every IIFE — 92% of our CDN bundle

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/120 (filed 2026-09-01, `tosijs-ui@1.12.7`)

**Context.** `tosijs-ui`'s `.` entry statically reaches CodeMirror, and an IIFE cannot code-split,
so `dist/index.js` inlines the whole editor for every CDN consumer. Measured on 1.12.7 with
minification on, from a clean `bun install --frozen-lockfile`: 1,839,671 raw / 577,813 gzip with
the barrel, versus 137,507 / 47,904 for the identical bundle with tosijs-ui removed — **the barrel
is 92% of the gzipped payload**. The ESM build is unaffected (tosijs-ui stays external, 7.3kB
gzip).

(The issue's original figures were ~625kB higher and claimed the bundle was *growing*. Both were
artifacts of a `node_modules` carrying nested duplicate `@codemirror` copies from incremental
`bun add`/`bun remove` cycles — the IIFE bundled each copy. Corrected in a comment on the issue;
release-over-release the bundle actually shrank 11%. Build release artifacts from a clean install.)

**Suggestion.** An editor-free entry — `tosijs-ui/components`, or narrow `.` so `code-editor` /
`live-example` / `doc-browser` are reachable only via the subpaths they already have. If importing
components individually through the `./*` wildcard is the supported way to avoid this, documenting
that is most of the fix.

---

## `.doc-content`'s inline `overflow: hidden` has no variable, so `layout: "full-screen"` can't scroll

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/119 (filed 2026-09-01, `tosijs-ui@1.12.7`)

**Context.** The doc-browser sets `.doc-content`'s `max-width`, `padding` and `overflow` as inline
styles. The first two are routed through `--doc-content-max-width` / `--doc-content-padding` so a
stylesheet can reach them; `overflow` is not. Two effects. `layout: "full-screen"` declares
`overflow: auto` on `.doc-content` in `doc-system-styles.ts`, which loses to the inline `hidden`
every time — so a full-screen page taller than its box is clipped and unscrollable, though its
`height: 100%` does land. And `overflow: hidden` on an ancestor disables `position: sticky`, which
is the whole mechanism `<tosi-product>` runs on, so every page here that hosts the engine still
carries `overflow: visible !important`. Adopting `layout: full-width` removed the other two
`!important`s from that rule and left this one.

**Suggestion.** `overflow: 'var(--doc-content-overflow, hidden)'`, with the `full-screen` rule
setting `_docContentOverflow` rather than `overflow`.

---

## `<tosi-map>` builds one `mapboxgl.Map` per render while `mapbox-gl.js` is still loading

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/13 (filed 2026-07-14, `tosijs-ui@1.6.22`)

**Context.** `MapBox.render()` takes its map-creation branch whenever `this._map` is falsy, but
`_map` is only assigned **asynchronously**, inside `MapBox.mapboxAvailable.then(...)`. Anything that
writes `coords` during the CDN-load window therefore starts another construction on every render —
and `<tosi-scroll-map>` writes `coords` once per animation frame as its section pins. Measured in
Chrome with the script resolution delayed 1.5s: **181 coords writes → 180 `mapboxgl.Map` instances
and 180 canvases inside a single `<tosi-map>`**, each with its own WebGL context and tile requests.
Chrome caps WebGL contexts around 16 and force-discards the oldest, so the *visible* map can end up
on a discarded context.

Second, subtler half: `_lastCoords` is updated **synchronously** on each of those pre-creation
renders, while the map is constructed from the coords captured in that render's closure. So once the
map exists, the update branch sees `coords === _lastCoords` and never applies the positions written
during loading — they're silently dropped and the map sits at a stale center.

**Why it didn't bite our demo.** At page load the hero's progress is 0, whose waypoint equals
`<tosi-map>`'s initial `coords`, so no write occurs and no re-render fires. Scroll into the map
section *while it is still loading* (slow network, cold cache) and you'd hit it.

**Suggestion.** Single-flight the construction with a `_mapPending` guard, and inside the `.then()`
read `this.coords` fresh (rather than the value captured at first render) before constructing, then
set `_lastCoords`. Offered to send a PR.

## ✅ RESOLVED (tosijs-ui 1.6.16) — `<tosi-3d>` has no declarative model source

**Resolution.** Landed in `tosijs-ui@1.6.16`. `<tosi-3d>` now takes declarative
attributes: `src` (a `.glb` URL, auto-loads on connect like `<img>`),
`clear-color` (css color or `transparent` to composite over the page theme),
`fov` (a lens multiplier — `<1` = long product-photography lens), and
`hero-light` (adds a directional key over the always-on hemispheric fill). A
soft hemi fill (intensity 0.6) is added whenever the scene has no lights of its
own, so `src` models never render black. The old Neo-demo look is now pure HTML:
`<tosi-3d src="/macbook_neo.glb" hero-light fov="0.6" clear-color="transparent">`.
Verified on the deployed docs (ui.tosijs.net/babylon-3d). Original note below.

**Context.** Every other media element in a scroll narrative self-loads from a
`src` attribute (`<video src>`, `<tosi-filmstrip src>`, `<tosi-lottie src>`), so
it works dropped straight into markdown HTML. `<tosi-3d>` (`babylon-3d.js`) has
no `static initAttributes` and reads no `src`/`url`/`model` attribute — loading a
model is the `loadScene(path, file)` **method** (babylon-3d.js:245), callable
only from JS (`sceneCreated`, or externally). A bare `<tosi-3d>` hydrates to an
empty scene. This is the ONE thing that stops a cinematic product narrative from
being 100% declarative HTML. (A default `ArcRotateCamera` IS created when no
`sceneCreated` is given — babylon-3d.js:289 — and `<tosi-scroll-camera>`
waypoints already drive it declaratively, so only the model load is the gap.)

**Suggestion (any of):** (A) add a declarative `src` attr to `tosi-3d` that
calls `loadScene` on connect (+ optional default `HemisphericLight`); or (C) ship
a tiny nested loader child, e.g. `<tosi-3d-model src="/x.glb">`, that calls the
parent's `loadScene` on connect — keeps markup declarative without changing the
core element. Then `<tosi-3d>` narratives are pure HTML like the rest.

## Doc-browser resets the tab `<title>` client-side, ignoring `headTitle`

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/6

**Context.** The static generator writes the right `<title>` (respects the doc's
`headTitle` metadata — verified: our home page's static `<title>` is
"tosijs-product — cinematic, scroll-driven product pages in HTML"). But after
hydration the doc-browser overwrites `document.title` with `doc.title —
projectName`, which for a home doc titled "tosijs-product" on a project named
"tosijs-product" yields the doubled "tosijs-product — tosijs-product". Crawlers
that use the served HTML get the good title; live visitors (and JS-rendering
crawlers) see the doubled one.

**Suggestion.** In the doc-browser's client-side title logic, honor `headTitle`
when present (same precedence the static generator uses in `generate-site.js`),
and de-dupe when `doc.title` already equals/contains `projectName`.

## `docPaths` silently shadowed by `outputDir`

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/5

**Context.** Our pre-adoption setup kept source `.md` docs in `docs/`. After
adoption, `outputDir` defaults to `docs/`, and `buildSite` begins with
`rm -rf <outputDir>` — so on the first build it deleted our source docs
before extracting them. The build kept going and produced a site with
nothing, no error. Easy to lose hours debugging this.

**Suggestion.** In `buildSite`, before the `rm -rf outputDir`, check whether
any entry in `docPaths` overlaps `outputDir` (exact match or descendant)
and throw with an actionable message. Costs nothing; saves real grief.

## `llms.txt generated (0 entries)` even when docs were extracted

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/7

**Context.** Our first build extracted 3 docs into `docs.json` but
`generateLlmsTxt` reports `0 entries`. Need to investigate whether this is
metadata-driven (docs lack a frontmatter shape that `make-llms-txt` looks
for) or a count-display bug. Either way the message is misleading.

**Suggestion.** Either reword the log so "0 entries" reflects the actual
behavior (e.g. "indexed N, included 0 in llms.txt because [reason]"), or
document the minimum metadata a doc needs to appear in llms.txt.

## Console errors from `tosi-product` upgrades during doc-system hydration

**Issue:** https://github.com/tonioloewald/tosijs-ui/issues/8

**Context.** Two `Cannot read properties of undefined (reading 'toggleAttribute')`
errors fire on a doc page that contains no `<tosi-product>` markup (just
inline-code references in prose). Custom-element registration runs
unconditionally; something is calling `toggleAttribute` on a value that
isn't there. Could be the engine running its connectedCallback against a
partial / stub element the doc-browser creates while rendering. Needs a
deeper look before publishing.

**Suggestion.** Once root-cause is identified, either guard inside our
engine OR (if the doc-browser is creating stub upgrades that shouldn't be)
fix that in tosijs-ui. Tracking here so we don't lose it.
