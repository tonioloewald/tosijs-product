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
  staticDirs: ["demo/static", "demo/assets"],

  // We do the library build (dist/index.js IIFE + dist/module.js ESM +
  // dist/*.d.ts) ourselves in bin/site.ts — see the note in that file about
  // why this can't just be `emitLibrary: true`.
  emitLibrary: false,
});
