import * as path from 'path'
import { statSync } from 'fs'
import { $ } from 'bun'

declare const Bun: any

const PORT = 8788
const PROJECT_ROOT = import.meta.dir
const PUBLIC = path.resolve(PROJECT_ROOT, 'demo')
const DIST = path.resolve(PROJECT_ROOT, 'dist')

async function build() {
  console.time('build')
  await $`mkdir -p ${DIST}`

  // Build the library
  await Bun.build({
    entrypoints: ['./src/index.ts'],
    outdir: DIST,
    target: 'browser',
    format: 'esm',
    naming: 'index.js',
  })

  // Build the demo
  await Bun.build({
    entrypoints: ['./demo/index.ts'],
    outdir: PUBLIC,
    target: 'browser',
    format: 'esm',
    naming: 'index.js',
  })
  console.timeEnd('build')
}

await build()

function serveFromDir(config: {
  directory: string
  path: string
}): Response | null {
  let basePath = path.join(config.directory, config.path)
  const suffixes = ['', '.html', 'index.html']

  for (const suffix of suffixes) {
    try {
      const pathWithSuffix = path.join(basePath, suffix)
      const stat = statSync(pathWithSuffix)
      if (stat && stat.isFile()) {
        return new Response(Bun.file(pathWithSuffix))
      }
    } catch (err) {}
  }

  return null
}

Bun.serve({
  port: PORT,
  fetch(request: any) {
    let reqPath = new URL(request.url).pathname
    if (reqPath === '/') reqPath = '/index.html'

    const buildResponse = serveFromDir({
      directory: PUBLIC,
      path: reqPath,
    })
    if (buildResponse) return buildResponse

    return new Response('File not found', {
      status: 404,
    })
  },
})

console.log(`Listening on http://localhost:${PORT}`)
