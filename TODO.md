# TODO

Follow-ups filed during releases (per the shared review/releasing practices). Newest first.

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
