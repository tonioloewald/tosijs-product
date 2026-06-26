/*
Build entry — a thin wrapper over tosijs-ui/site's reusable build system.

The site (static pages, hydration bundle, llms.txt) is built by `buildSite`
from tosijs-ui/site. We ALSO produce the npm-publish artefacts in `dist/`
(ESM `module.js` + IIFE `index.js` + types) by re-running the previous
custom build inside `buildLibrary()` — `emitLibrary: true` in the site
config would run `tsc --declaration --outDir dist`, but we need a tighter
shape than tsc alone gives us (Bun-bundled ESM, IIFE for jsdelivr,
flattened .d.ts paths).

  bun bin/site.ts              # build, then start the dev server
  bun bin/site.ts --build      # build and exit (0/1)
*/

import { $ } from "bun";
import siteConfig from "../tosijs-product-site.config";
import { buildSite, devServer } from "tosijs-ui/site";

declare global {
  // bunlint
  var Bun: any;
}

async function buildLibrary() {
  // Types: emit declarations only (the JS bundles come from Bun.build below).
  await $`bun tsc --declaration --emitDeclarationOnly --target es2022 --outDir dist`.nothrow();
  // tsc writes under dist/src/...; flatten the entry types up to dist/ so
  // package.json's `types` and per-file imports resolve.
  await $`mv dist/src/index.d.ts dist/index.d.ts`.nothrow();
  await $`mv dist/src/tosi-product.d.ts dist/tosi-product.d.ts`.nothrow();
  await $`rm -rf dist/src dist/demo dist/bin dist/dev.d.ts`.nothrow();

  // ESM bundle for `import x from 'tosijs-product'`. tosijs / tosijs-ui stay
  // external so we don't ship multiple copies.
  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: "dist",
    target: "browser",
    format: "esm",
    naming: "module.js",
    external: ["tosijs", "tosijs-ui"],
  });

  // Self-contained IIFE for <script src=...> consumers (CDN). Bundles
  // tosijs and tosijs-ui so the page only needs one script tag.
  await Bun.build({
    entrypoints: ["./src/index-iife.ts"],
    outdir: "dist",
    target: "browser",
    format: "iife",
    naming: "index.js",
  });
}

const buildAll = async () => {
  const ok = await buildSite(siteConfig);
  if (!ok) throw new Error("site build failed");
  await buildLibrary();
};

if (!(await buildSite(siteConfig))) process.exit(1);
await buildLibrary();

if (process.argv.includes("--build")) process.exit(0);

await devServer(siteConfig, { build: buildAll });
