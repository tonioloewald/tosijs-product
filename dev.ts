import * as path from "path";
import { statSync } from "fs";
import { $ } from "bun";

declare const Bun: any;

const PORT = 8788;
const PROJECT_ROOT = import.meta.dir;
const PUBLIC = path.resolve(PROJECT_ROOT, "demo");
const DIST = path.resolve(PROJECT_ROOT, "dist");
const buildOnly = process.argv.includes("--build");

async function build() {
  console.time("build");
  await $`rm -rf ${DIST} || true`;
  await $`mkdir -p ${DIST}`;

  // Generate .d.ts files
  await $`bun tsc --declaration --emitDeclarationOnly --target es2022 --outDir dist`;
  await $`mv dist/src/index.d.ts dist/index.d.ts || true`;
  await $`mv dist/src/tosi-product.d.ts dist/tosi-product.d.ts || true`;
  await $`rm -rf dist/src dist/demo dist/dev.d.ts || true`;

  // Build the library (ESM) — peer deps are external for bundler consumers
  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: DIST,
    target: "browser",
    format: "esm",
    naming: "module.js",
    external: ["tosijs", "tosijs-ui"],
  });

  // Build the library (IIFE) — separate entry point that assigns to globalThis
  await Bun.build({
    entrypoints: ["./src/index-iife.ts"],
    outdir: DIST,
    target: "browser",
    format: "iife",
    naming: "index.js",
  });

  // Build the demo
  await Bun.build({
    entrypoints: ["./demo/index.ts"],
    outdir: PUBLIC,
    target: "browser",
    format: "esm",
    naming: "index.js",
  });
  console.timeEnd("build");
}

await build();

if (buildOnly) {
  process.exit(0);
}

function serveFromDir(config: {
  directory: string;
  path: string;
}): Response | null {
  let basePath = path.join(config.directory, config.path);
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix));
      }
    } catch (err) {}
  }

  return null;
}

Bun.serve({
  port: PORT,
  fetch(request: any) {
    let reqPath = new URL(request.url).pathname;
    if (reqPath === "/") reqPath = "/index.html";

    const publicResponse = serveFromDir({
      directory: PUBLIC,
      path: reqPath,
    });
    if (publicResponse) return publicResponse;

    // Allow serving from dist
    if (reqPath.startsWith("/dist/")) {
      const distResponse = serveFromDir({
        directory: PROJECT_ROOT,
        path: reqPath,
      });
      if (distResponse) return distResponse;
    }

    return new Response("File not found", {
      status: 404,
    });
  },
});

console.log(`Listening on http://localhost:${PORT}`);
