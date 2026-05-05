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

  await $`bun tsc --declaration --emitDeclarationOnly --target es2022 --outDir dist`;
  await $`mv dist/src/index.d.ts dist/index.d.ts || true`;
  await $`mv dist/src/tosi-product.d.ts dist/tosi-product.d.ts || true`;
  await $`rm -rf dist/src dist/demo dist/dev.d.ts || true`;

  await Bun.build({
    entrypoints: ["./src/index.ts"],
    outdir: DIST,
    target: "browser",
    format: "esm",
    naming: "module.js",
    external: ["tosijs", "tosijs-ui"],
  });

  await Bun.build({
    entrypoints: ["./src/index-iife.ts"],
    outdir: DIST,
    target: "browser",
    format: "iife",
    naming: "index.js",
  });

  await Bun.build({
    entrypoints: ["./demo/index.ts"],
    outdir: PUBLIC,
    target: "browser",
    format: "esm",
    naming: "index.js",
  });

  await Bun.build({
    entrypoints: ["./demo/v2.ts"],
    outdir: PUBLIC,
    target: "browser",
    format: "esm",
    naming: "v2.js",
  });

  await Bun.build({
    entrypoints: ["./demo/v2-embed.ts"],
    outdir: PUBLIC,
    target: "browser",
    format: "esm",
    naming: "v2-embed.js",
  });

  await Bun.build({
    entrypoints: ["./demo/v2-theme.ts"],
    outdir: PUBLIC,
    target: "browser",
    format: "esm",
    naming: "v2-theme.js",
  });
  console.timeEnd("build");
}

await build();

if (buildOnly) {
  process.exit(0);
}

function findFile(directory: string, reqPath: string): string | null {
  const basePath = path.join(directory, reqPath);
  const suffixes = ["", ".html", "index.html"];

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix);
      const stat = statSync(pathWithSuffix);
      if (stat && stat.isFile()) return pathWithSuffix;
    } catch (err) {}
  }

  return null;
}

function serveFile(filePath: string, request: any): Response {
  const file = Bun.file(filePath);
  const range = request.headers.get("range");
  if (range) {
    const match = range.match(/bytes=(\d+)-(\d*)/);
    if (match) {
      const start = parseInt(match[1]);
      const end = match[2] ? parseInt(match[2]) : file.size - 1;
      return new Response(file.slice(start, end + 1), {
        status: 206,
        headers: {
          "Content-Range": `bytes ${start}-${end}/${file.size}`,
          "Accept-Ranges": "bytes",
          "Content-Length": String(end - start + 1),
          "Content-Type": file.type,
        },
      });
    }
  }
  return new Response(file, {
    headers: {
      "Accept-Ranges": "bytes",
      "Cache-Control": "no-store, must-revalidate",
    },
  });
}

Bun.serve({
  port: PORT,
  fetch(request: any) {
    let reqPath = new URL(request.url).pathname;
    if (reqPath === "/") reqPath = "/index.html";

    // Serve from project root first (for root index.html, demo/*, dist/*)
    const rootFile = findFile(PROJECT_ROOT, reqPath);
    if (rootFile) return serveFile(rootFile, request);

    // Fallback to demo/ dir (for legacy /index.html -> demo/index.html)
    const publicFile = findFile(PUBLIC, reqPath);
    if (publicFile) return serveFile(publicFile, request);

    return new Response("File not found", {
      status: 404,
    });
  },
});

console.log(`Listening on http://localhost:${PORT}`);
