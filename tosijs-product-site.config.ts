/*
Doc-site configuration for tosijs-product.

Consumed by `bin/site.ts` (the build entry) and fed into tosijs-ui/site's
`buildSite` / `devServer`. See `tosijs-ui/site/site-config.ts` for the full set
of options.
*/

import { defineSiteConfig } from "tosijs-ui/site";

const PROJECT = "tosijs-product";

export default defineSiteConfig({
  name: PROJECT,
  description: "Scroll-linked animation components for tosijs.",
  baseUrl: "https://product.tosijs.net",
  host: "github-pages",
  favicon: "/favicon.svg",

  // tosijs-ui's own doc site claims the 8787 default — use a distinct port so
  // both dev servers can run side by side.
  port: 8788,

  projectLinks: {
    tosijs: "https://tosijs.net",
    github: `https://github.com/tonioloewald/${PROJECT}`,
  },

  navbarLinks: [
    { href: "https://tosijs.net", label: "tosijs", icon: "tosi" },
    { href: "https://ui.tosijs.net", label: "tosijs-ui", icon: "tosi" },
    { href: "https://3d.tosijs.net", label: "tosijs-3d", icon: "tosi" },
    {
      href: `https://github.com/tonioloewald/${PROJECT}`,
      label: "github",
      icon: "github",
    },
    {
      href: `https://www.npmjs.com/package/${PROJECT}`,
      label: "npmjs",
      icon: "npm",
    },
  ],

  // The hydration bundle: registers tosi-product custom elements + exposes
  // them to live examples via the doc-system's `context` map.
  bundleEntry: "./demo/site.ts",

  // Doc sources. README is the home page (the cinematic landing); src/
  // is scanned for tosijs doc-comment blocks AND src/docs/ for extra .md pages.
  // (Don't include 'docs/' as a source — that's `outputDir`, wiped on every build.)
  docPaths: ["src", "README.md"],

  // Static files copied into the served web root (favicon, model files, etc.).
  // demo/assets/* lands at the web ROOT — reference media as `/agent-owl.mp4`,
  // `/macbook_neo.glb`, etc. (NOT `assets/...`). (`demo/static` doesn't exist.)
  staticDirs: ["demo/assets"],

  // Dev-server "Edit page source" — view/edit a page's whole Markdown source in
  // the browser, save back to the .md (rebuild + refresh), or Download it. The
  // Download affordance also works on the deployed site. Dev write-back is local
  // only (writes confined to the repo root). See tosijs-ui/site dev-server.
  editableSources: true,

  // We do the library build (dist/index.js IIFE + dist/module.js ESM +
  // dist/*.d.ts) ourselves in bin/site.ts — see the note in that file about
  // why this can't just be `emitLibrary: true`.
  emitLibrary: false,
});
