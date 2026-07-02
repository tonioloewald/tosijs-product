# Upstream notes (tosijs-ui)

Things we found while adopting `tosijs-ui/site` in `tosijs-product` that
seem worth raising in tosijs-ui (or in tosijs / the broader ecosystem)
rather than working around locally. Add new entries at the top with a
short context block and a concrete suggestion.

## Strategic — `tosijs-product` as a first-class integration target

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

## `<tosi-3d>` has no declarative model source

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

**Context.** Our pre-adoption setup kept source `.md` docs in `docs/`. After
adoption, `outputDir` defaults to `docs/`, and `buildSite` begins with
`rm -rf <outputDir>` — so on the first build it deleted our source docs
before extracting them. The build kept going and produced a site with
nothing, no error. Easy to lose hours debugging this.

**Suggestion.** In `buildSite`, before the `rm -rf outputDir`, check whether
any entry in `docPaths` overlaps `outputDir` (exact match or descendant)
and throw with an actionable message. Costs nothing; saves real grief.

## `llms.txt generated (0 entries)` even when docs were extracted

**Context.** Our first build extracted 3 docs into `docs.json` but
`generateLlmsTxt` reports `0 entries`. Need to investigate whether this is
metadata-driven (docs lack a frontmatter shape that `make-llms-txt` looks
for) or a count-display bug. Either way the message is misleading.

**Suggestion.** Either reword the log so "0 entries" reflects the actual
behavior (e.g. "indexed N, included 0 in llms.txt because [reason]"), or
document the minimum metadata a doc needs to appear in llms.txt.

## Console errors from `tosi-product` upgrades during doc-system hydration

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
