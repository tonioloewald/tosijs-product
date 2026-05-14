import {
  tosiProduct,
  tosiProductSection,
  tosiProductHeader,
  TosiProduct,
  TosiProductSection,
} from "../src/tosi-product";
import { tosiInterpolator, tosiWaypoint } from "../src/tosi-interpolator";
import { tosiFilmstrip } from "../src/tosi-filmstrip";
import { tosiScrollCamera } from "../src/tosi-b3d-scroll";
import { highlightCodeBlocks } from "../src/tosi-prism";
import { markdownViewer, bodymovinPlayer, mapBox, b3d } from "tosijs-ui";
import { elements } from "tosijs";

const { div, header, footer, nav, h1, h2, p, span, a, video } = elements;

// Coordinates for the mapbox fly-around scene.
const HMB = { lat: 37.4636, lng: -122.4286 };
const OULU = { lat: 65.0121, lng: 25.4651 };
const MAPBOX_TOKEN =
  "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA";
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// === Themes =================================================================
const themes = {
  midnight: {
    "--bg": "#08081a",
    "--fg": "#f0f0f5",
    "--muted": "#a0a0b8",
    "--accent": "#9be7ff",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)",
  },
  forest: {
    "--bg": "#0a1f14",
    "--fg": "#e8f5ee",
    "--muted": "#9bbaa6",
    "--accent": "#7fdba0",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)",
  },
  paper: {
    "--bg": "#f5f1e8",
    "--fg": "#1a1815",
    "--muted": "#6b6862",
    "--accent": "#7c3aed",
    "--surface": "rgba(0,0,0,0.04)",
    "--border": "rgba(0,0,0,0.08)",
    "--code-bg": "rgba(0,0,0,0.05)",
  },
  rose: {
    "--bg": "#2a0820",
    "--fg": "#ffeef5",
    "--muted": "#d8a8c0",
    "--accent": "#ff80b5",
    "--surface": "rgba(255,255,255,0.06)",
    "--border": "rgba(255,255,255,0.12)",
    "--code-bg": "rgba(255,255,255,0.04)",
  },
};

// === Styles =================================================================
const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0;
    background: var(--bg, #000);
    color: var(--fg, #fff);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    transition: background-color 0.25s linear;
  }

  /* === Page chrome === */
  .page-header, .page-footer, .sticky-bar {
    background: var(--bg);
    color: var(--fg);
    transition:
      background-color 0.25s linear,
      color 0.25s linear,
      border-color 0.25s linear;
  }
  .page-header {
    border-bottom: 1px solid var(--border);
    padding: 1rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .page-header .brand { font-weight: 700; font-size: 1.1rem; }
  .page-header nav { display: flex; gap: 1.25rem; }
  .page-header nav a {
    color: var(--muted); text-decoration: none; font-size: 0.9rem;
    transition: color 0.2s ease;
  }
  .page-header nav a:hover { color: var(--accent); }

  .sticky-bar {
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    padding: 0.7rem 2rem;
    display: flex; align-items: center; justify-content: space-between;
  }
  .sticky-bar .brand { font-weight: 700; font-size: 1rem; }
  .sticky-bar .progress {
    font-family: monospace; font-size: 0.8rem; color: var(--muted);
  }

  .page-footer {
    border-top: 1px solid var(--border);
    padding: 3rem 2rem;
    text-align: center; color: var(--muted);
  }
  .page-footer p { margin: 0; }
  .page-footer a { color: var(--accent); text-decoration: none; }

  /* === Scenes === */
  .scene {
    height: 100vh;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center; position: relative;
    background: var(--bg); color: var(--fg);
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .scene h1 {
    font-size: clamp(2.5rem, 9vw, 6rem); margin: 0 0 0.2em; font-weight: 800;
    letter-spacing: -0.02em;
  }
  .scene h2 {
    font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.4em; font-weight: 800;
  }
  .scene p {
    font-size: clamp(1rem, 1.6vw, 1.25rem); color: var(--muted);
    max-width: 580px; margin: 0;
  }
  .scene .pill {
    display: inline-block; margin-top: 1.5em;
    background: var(--surface); border: 1px solid var(--border);
    color: var(--accent); font-family: monospace; font-size: 0.85rem;
    padding: 0.5em 1.2em; border-radius: 999px;
  }

  /* === Markdown intro blocks === */
  .intro {
    background: var(--bg); color: var(--fg);
    padding: clamp(3rem, 10vh, 7rem) 1.5rem;
    display: flex; justify-content: center;
    transition: background-color 0.25s linear, color 0.25s linear;
  }
  .intro tosi-md {
    display: block; max-width: 640px;
    line-height: 1.7; font-size: clamp(1rem, 1.55vw, 1.15rem);
  }
  .intro tosi-md h2 {
    font-size: clamp(1.6rem, 3.5vw, 2.4rem); margin: 0 0 0.6em; font-weight: 800;
  }
  .intro tosi-md p { color: var(--muted); margin: 0 0 1em; }
  .intro tosi-md p:last-child { margin: 0; }
  .intro tosi-md strong { color: var(--fg); }
  .intro tosi-md :not(pre) > code {
    background: var(--code-bg); padding: 0.12em 0.4em;
    border-radius: 4px; font-size: 0.9em;
    font-family: Consolas, Monaco, "Courier New", monospace;
  }
  .intro tosi-md pre {
    background: var(--code-bg);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 0.9em 1.1em;
    overflow-x: auto;
    font-size: 0.85em;
    line-height: 1.55;
  }
  .intro tosi-md pre code {
    background: transparent; padding: 0;
    font-family: Consolas, Monaco, "Courier New", monospace;
  }
  .intro tosi-md ul { padding-left: 1.2em; margin: 0 0 1em; }
  .intro tosi-md li { color: var(--muted); margin-bottom: 0.3em; }
  .intro tosi-md li code { color: var(--fg); }

  /* === Staged reveal feature list === */
  .feature-list {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 0.5em; max-width: 580px; padding: 0 1.5rem;
  }
  .feature-list h2, .feature-list p { text-align: left; }
  .feature-row {
    font-size: 1.05rem;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: 10px; padding: 0.7em 1.1em; margin-top: 0.3em;
    font-family: monospace; color: var(--fg);
  }

  /* === Embedded vertical scroll region === */
  .embed-host {
    background: var(--bg); padding: clamp(2rem, 5vh, 4rem) 1.5rem;
    transition: background-color 0.25s linear;
  }
  .embed-host h2 {
    text-align: center; max-width: 720px; margin: 0 auto 0.4em;
    font-size: clamp(1.5rem, 4vw, 2.2rem);
  }
  .embed-host > p {
    text-align: center; max-width: 560px; margin: 0 auto 2em;
    color: var(--muted);
  }
  .embed-frame {
    height: 60vh; max-width: 880px; margin: 0 auto;
    border: 1px solid var(--border); border-radius: 14px;
    overflow: hidden; background: var(--surface);
  }
  .embed-frame.scroll-y { overflow-y: auto; overflow-x: hidden; }
  .embed-frame.scroll-y::-webkit-scrollbar { width: 8px; }
  .embed-frame.scroll-y::-webkit-scrollbar-thumb {
    background: var(--border); border-radius: 4px;
  }
  .inner-scene {
    /* Use the engine's view size so each inner section pins to a full card,
       independent of the document viewport. */
    height: var(--tosi-view-size, 100%);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 2rem; text-align: center;
    color: var(--fg);
  }
  .inner-scene h3 {
    font-size: clamp(1.4rem, 3.5vw, 2rem); margin: 0 0 0.3em;
    background: linear-gradient(180deg, var(--fg), var(--muted));
    -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  }
  .inner-scene p {
    color: var(--fg); max-width: 460px; margin: 0;
    opacity: 0.85; font-size: 1rem;
  }
  .h-card {
    /* Size to the engine's view size (engine writes --tosi-view-size).
       Avoids the 100vw / flex-max-content collapse problem when nested. */
    width: var(--tosi-view-size, 100%); height: 100%; flex-shrink: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 2rem; text-align: center; color: #fff;
    white-space: normal;
  }
  .h-card h3 { font-size: 1.8rem; margin: 0 0 0.3em; }
  .h-card p { max-width: 320px; opacity: 0.9; }

  /* === Hero scroll-down arrow uses the theme accent === */
  .hero-pill {
    position: absolute; left: 50%; bottom: 6vh; transform: translateX(-50%);
    color: var(--muted); font-size: 0.7rem;
    letter-spacing: 0.25em; text-transform: uppercase;
  }

  /* === Full-bleed media scene === */
  .media-scene {
    position: relative;
    height: var(--tosi-view-size, 100vh);
    overflow: hidden;
    background: #000;
  }
  .media-scene > video,
  .media-scene > tosi-filmstrip,
  .media-scene > tosi-3d,
  .media-scene > tosi-map {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; display: block;
  }
  .media-scene.b3d {
    background: radial-gradient(ellipse at center, #1a1a2e 0%, #000 100%);
  }
  /* Lottie SVGs don't object-fit — center it at a contained size and let
     the scene background show through. */
  .media-scene.lottie {
    background: radial-gradient(ellipse at center, #0a0a18 0%, #000 100%);
  }
  .media-scene > tosi-lottie {
    position: absolute;
    left: 50%; top: 50%;
    transform: translate(-50%, -50%);
    width: min(70vh, 60vw);
    height: min(70vh, 60vw);
  }
  .media-overlay {
    position: absolute; inset: 0;
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    pointer-events: none; text-align: center;
    color: #fff; padding: 2rem;
  }
  .media-overlay h2 {
    font-size: clamp(2rem, 6vw, 4rem); margin: 0 0 0.3em; font-weight: 800;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,0.85))
            drop-shadow(0 0 40px rgba(0,0,0,0.6));
  }
  .media-overlay p {
    color: #ddd; max-width: 560px; margin: 0;
    font-size: clamp(1rem, 1.6vw, 1.2rem);
    filter: drop-shadow(0 1px 6px rgba(0,0,0,0.9));
  }
`;
document.head.appendChild(style);

// === Page chrome ============================================================
const pageHeader = header(
  { class: "page-header" },
  div({ class: "brand" }, "tosijs-product"),
  nav(
    a({ href: "https://github.com/tonioloewald/tosijs-product" }, "GitHub"),
    a({ href: "https://product.tosijs.net" }, "Docs"),
    a({ href: "https://www.npmjs.com/package/tosijs-product" }, "npm"),
    a({ href: "https://tosijs.net" }, "tosijs"),
    a({ href: "https://ui.tosijs.net" }, "tosijs-ui"),
    a({ href: "https://3d.tosijs.net" }, "tosijs-3d")
  )
);

const stickyProgressLabel = span({ class: "progress" }, "0%");
const stickyHeader = tosiProductHeader(
  { threshold: 80 },
  div(
    { class: "sticky-bar" },
    div({ class: "brand" }, "tosijs-product"),
    stickyProgressLabel
  )
);

const pageFooter = footer(
  { class: "page-footer" },
  p(
    "Built with ",
    a({ href: "https://tosijs.net" }, "tosijs"),
    ". Source on ",
    a({ href: "https://github.com/tonioloewald/tosijs-product" }, "GitHub"),
    "."
  )
);

// === Helpers ================================================================
// markdownViewer renders the markdown to <pre><code class="language-…"> blocks;
// didRender runs after each render so we re-highlight in place (idempotent).
const md = (markdown: string) =>
  div(
    { class: "intro" },
    markdownViewer(
      {
        apply(el: Element) {
          const mv = el as any;
          mv.didRender = () => {
            void highlightCodeBlocks(mv);
          };
        },
      },
      markdown
    )
  );

// Fades the overlay text in then out over a sub-range of section progress.
const mediaOverlay = (range: string, title: string, subtitle?: string) =>
  tosiInterpolator(
    {
      "data-scroll-animate": true,
      "data-scroll-range": range,
      easing: "ease-in-out",
    },
    tosiWaypoint({
      progress: 0,
      style: { opacity: 0, transform: "translateY(20px)" },
    }),
    tosiWaypoint({
      progress: 0.5,
      style: { opacity: 1, transform: "translateY(0px)" },
    }),
    tosiWaypoint({
      progress: 1,
      style: { opacity: 0, transform: "translateY(-20px)" },
    }),
    div(
      { class: "media-overlay" },
      h2(title),
      ...(subtitle ? [p(subtitle)] : [])
    )
  );

const stagedRow = (label: string, start: number, end: number) =>
  tosiInterpolator(
    {
      "data-scroll-animate": true,
      "data-scroll-range": `${start},${end}`,
      easing: "ease-in-out",
    },
    tosiWaypoint({
      progress: 0,
      style: { opacity: 0, transform: "translateX(-40px)" },
    }),
    tosiWaypoint({
      progress: 0.5,
      style: { opacity: 1, transform: "translateX(0px)" },
    }),
    tosiWaypoint({
      progress: 1,
      style: { opacity: 1, transform: "translateX(0px)" },
    }),
    div({ class: "feature-row" }, "✓ " + label)
  );

// === Engine =================================================================
const app = tosiProduct(
  // ===== HERO =====
  tosiProductSection(
    { scroll: 100, theme: "midnight" },
    div(
      { class: "scene" },
      tosiInterpolator(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({
          progress: 0.0,
          style: { transform: "scale(1) translateY(0px)" },
        }),
        tosiWaypoint({
          progress: 1.0,
          style: { transform: "scale(1.4) translateY(20px)" },
        }),
        h1("tosijs-product")
      ),
      p("Build cinematic product pages with HTML."),
      div({ class: "hero-pill" }, "scroll")
    )
  ),

  // ===== INTRO =====
  md(
    `## What is tosijs-product?

A small library for building **scroll-driven product pages** — the cinematic, "Apple-style" pages where scrolling becomes the timeline.

You compose a stack of \`<tosi-product-section>\` elements inside a \`<tosi-product>\`. Each section claims a slice of scroll runway: it pins at the viewport top, animations run during pin, then it scrolls out at 1:1 as the next section takes over.

This whole page is one engine. Read on to see what each piece does.`
  ),

  // ===== INTERPOLATOR =====
  tosiProductSection(
    { scroll: 200, theme: "midnight" },
    div(
      { class: "scene" },
      tosiInterpolator(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({
          progress: 0.0,
          style: { opacity: 0, transform: "translateY(60px) scale(0.95)" },
        }),
        tosiWaypoint({
          progress: 0.4,
          style: { opacity: 1, transform: "translateY(0px) scale(1)" },
        }),
        tosiWaypoint({
          progress: 1.0,
          style: { opacity: 1, transform: "translateY(0px) scale(1)" },
        }),
        h2("Interpolator")
      ),
      p(
        "A waypoint timeline for any CSS property. Set keyframes by progress and let the engine drive the rest."
      ),
      span({ class: "pill" }, "<tosi-interpolator>")
    )
  ),

  md(
    `## \`<tosi-interpolator>\`

Drop an interpolator inside a section and tag it \`data-scroll-animate\`. Each \`<tosi-waypoint>\` child sets the styles to apply at a given progress; the engine writes interpolated values onto the target element as you scroll.

\`\`\`html
<tosi-product-section scroll="200">
  <tosi-interpolator data-scroll-animate easing="ease-in-out">
    <tosi-waypoint progress="0"   style="opacity: 0; transform: translateY(60px)"></tosi-waypoint>
    <tosi-waypoint progress="0.4" style="opacity: 1; transform: translateY(0)"></tosi-waypoint>
    <tosi-waypoint progress="1"   style="opacity: 1; transform: translateY(0)"></tosi-waypoint>
    <h2>Interpolator</h2>
  </tosi-interpolator>
</tosi-product-section>
\`\`\`

**Attributes**

- \`data-scroll-animate\` — required for the section to drive it.
- \`easing\` — \`"ease-in-out"\` applies easeInOutQuad between waypoints. Default is linear.
- \`data-scroll-range="start,end"\` — constrain the interpolator to a sub-range of section progress (see below).

The interpolator handles numbers inside any property — transforms, opacity, colors. Non-numeric properties step at the midpoint.`
  ),

  // ===== STAGED REVEAL =====
  tosiProductSection(
    { scroll: 300, theme: "midnight" },
    div(
      { class: "scene" },
      div(
        { class: "feature-list" },
        h2("Staged reveal"),
        p(
          "Multiple interpolators in one section, each scoped to a slice of progress with data-scroll-range:"
        ),
        stagedRow("Sticky window pins the engine", 0.05, 0.2),
        stagedRow("Stack translates as you scroll", 0.2, 0.35),
        stagedRow("Sections pin then exit", 0.35, 0.5),
        stagedRow("Sub-range staging schedules the rest", 0.5, 0.65)
      )
    )
  ),

  md(
    `## \`data-scroll-range\`

A section's progress runs 0 → 1 across its pin. \`data-scroll-range="start,end"\` rescales that to a sub-range, so multiple interpolators can each own their own slice of the section.

\`\`\`html
<tosi-product-section scroll="300">
  <tosi-interpolator data-scroll-animate data-scroll-range="0.05,0.2">…</tosi-interpolator>
  <tosi-interpolator data-scroll-animate data-scroll-range="0.2,0.35">…</tosi-interpolator>
  <tosi-interpolator data-scroll-animate data-scroll-range="0.35,0.5">…</tosi-interpolator>
</tosi-product-section>
\`\`\`

Outside its range each interpolator clamps to 0 or 1 — animations are at rest before they start and after they finish. Sub-ranges work on any \`data-scroll-animate\` element, not just interpolators.`
  ),

  // ===== VIDEO SCRUBBING =====
  tosiProductSection(
    { scroll: 300, theme: "midnight" },
    div(
      { class: "media-scene" },
      video({
        src: "assets/agent-owl.mp4",
        "data-scroll-animate": "currentTime",
        muted: true,
        playsinline: true,
        preload: "auto",
      }),
      mediaOverlay(
        "0,0.4",
        "Scrub video",
        'data-scroll-animate="currentTime" maps progress to video.currentTime — frame-perfect scrubbing.'
      ),
      mediaOverlay("0.5,1", "Native <video>, no plugin")
    )
  ),

  md(
    `## Video scrubbing

\`data-scroll-animate="currentTime"\` on a \`<video>\` makes the section set \`video.currentTime = progress * video.duration\` on every scroll tick.

\`\`\`html
<tosi-product-section scroll="300">
  <video src="clip.mp4"
         data-scroll-animate="currentTime"
         muted playsinline preload="auto"></video>
</tosi-product-section>
\`\`\`

**Caveats.** Browser video decoders aren't built for random-access seeking — long clips, large frames, or non-keyframe-dense codecs all stutter. Keep clips short and dense in keyframes, or use the filmstrip mosaic approach below for buttery scrubbing.

\`muted\` and \`playsinline\` are required for the video to be considered "auto-playable", which is what unlocks programmatic \`currentTime\` updates without user interaction.`
  ),

  // ===== FILMSTRIP MOSAIC =====
  tosiProductSection(
    { scroll: 300, theme: "midnight" },
    div(
      { class: "media-scene" },
      tosiFilmstrip({
        src: "assets/agent-owl_10x10_100.jpg",
        cols: 10,
        rows: 10,
        total: 100,
        "data-scroll-animate": "true",
      }),
      mediaOverlay(
        "0,0.4",
        "100 frames. One image.",
        "Zero video decode. Instant seeking. Works everywhere."
      ),
      mediaOverlay("0.5,1", "Hardware-accelerated canvas blits")
    )
  ),

  md(
    `## \`<tosi-filmstrip>\`

Packs every frame of a clip into one image mosaic (WebP or JPG) and blits the right cell to a canvas on every scroll tick. No decode pipeline, no keyframe lookups — just \`drawImage\`.

Generate the mosaic with the bundled CLI:

\`\`\`bash
bunx tosi-mosaic clip.mp4 --frames 100 --width 1280
# emits clip_10x10_100.webp
\`\`\`

\`\`\`html
<tosi-product-section scroll="300">
  <tosi-filmstrip src="clip_10x10_100.webp" data-scroll-animate></tosi-filmstrip>
</tosi-product-section>
\`\`\`

The filename suffix \`_COLSxROWS_TOTAL\` is parsed automatically, so you don't need to spell out grid attributes. A grid is used instead of a single long strip because browsers cap image dimensions around 16,384 px — a 10×10 mosaic keeps you well inside GPU limits and fits 100 frames in one request.`
  ),

  // ===== LOTTIE =====
  tosiProductSection(
    { scroll: 250, theme: "midnight" },
    div(
      { class: "media-scene lottie" },
      bodymovinPlayer({
        src: "assets/tosi-platform.json",
        "data-scroll-animate": "lottie",
        config: { renderer: "svg", autoplay: false, loop: false },
      }),
      mediaOverlay(
        "0,0.5",
        "Vector animation",
        "Bodymovin / Lottie JSON, scrubbed by scroll."
      ),
      mediaOverlay("0.5,1", "Frame-perfect at every zoom")
    )
  ),

  md(
    `## \`<tosi-lottie>\`

\`<tosi-lottie>\` (from tosijs-ui) wraps the Bodymovin runtime. With \`data-scroll-animate="lottie"\` the engine calls \`animation.goToAndStop(progress * totalFrames, true)\` on every scroll tick — frame-accurate SVG playback.

\`\`\`html
<tosi-product-section scroll="250">
  <tosi-lottie src="animation.json"
               data-scroll-animate="lottie"></tosi-lottie>
</tosi-product-section>
\`\`\`

Pass \`config\` via JS to pick the renderer (\`svg\` / \`canvas\` / \`html\`) and disable autoplay/loop so the scroll position owns playback. Lottie SVGs don't \`object-fit\` like \`<video>\` does — center them at a contained size or rely on the player's intrinsic viewBox.`
  ),

  // ===== BABYLONJS 3D =====
  tosiProductSection(
    { scroll: 350, theme: "midnight" },
    div(
      { class: "media-scene b3d" },
      b3d({
        "data-scroll-animate": "babylon",
        async sceneCreated(element: any, BABYLON: any) {
          const { scene } = element;
          const camera = new BABYLON.ArcRotateCamera(
            "camera",
            -Math.PI / 2,
            Math.PI / 3,
            80,
            new BABYLON.Vector3(0, 10, 0),
            scene
          );
          scene.activeCamera = camera;
          camera.minZ = 0.1;
          camera.fov = camera.fov * 0.6;
          scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
          new BABYLON.HemisphericLight(
            "hemi",
            new BABYLON.Vector3(0, 1, 0),
            scene
          ).intensity = 0.6;
          const dir = new BABYLON.DirectionalLight(
            "dir",
            new BABYLON.Vector3(-1, -2, 1),
            scene
          );
          dir.intensity = 0.8;
          element.loadScene("assets/", "macbook_neo.glb");
        },
      }),
      tosiScrollCamera(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({ progress: 0, alpha: -1.57, beta: 1.2, radius: 110 }),
        tosiWaypoint({ progress: 0.5, alpha: 0, beta: 1.0, radius: 70 }),
        tosiWaypoint({ progress: 1, alpha: 1.57, beta: 1.55, radius: 76 })
      ),
      mediaOverlay("0,0.4", "MacBook Neo."),
      mediaOverlay("0.5,1", "Every angle, scroll-driven.")
    )
  ),

  md(
    `## \`<tosi-3d>\` + \`<tosi-scroll-camera>\`

\`<tosi-3d>\` (from tosijs-ui) hosts a BabylonJS scene. \`sceneCreated\` runs once with the live \`element\` and the \`BABYLON\` namespace — set up the camera, lights, and call \`element.loadScene(path, file)\` for your GLB/glTF.

\`<tosi-scroll-camera>\` is a sibling that drives the scene's active \`ArcRotateCamera\` via waypoint-interpolated \`alpha\`, \`beta\`, \`radius\`, plus optional \`position\` and \`fov\`.

\`\`\`html
<tosi-product-section scroll="350">
  <tosi-3d data-scroll-animate="babylon"></tosi-3d>
  <tosi-scroll-camera data-scroll-animate easing="ease-in-out">
    <tosi-waypoint progress="0"   alpha="-1.57" beta="1.2"  radius="110"></tosi-waypoint>
    <tosi-waypoint progress="0.5" alpha="0"     beta="1.0"  radius="70"></tosi-waypoint>
    <tosi-waypoint progress="1"   alpha="1.57"  beta="1.55" radius="76"></tosi-waypoint>
  </tosi-scroll-camera>
</tosi-product-section>
\`\`\`

Companion components \`<tosi-scroll-time>\` (skybox time-of-day) and \`<tosi-scroll-animation>\` (named AnimationGroups) plug into the same scene.`
  ),

  // ===== MAPBOX =====
  tosiProductSection(
    {
      scroll: 400,
      theme: "midnight",
      apply(el: Element) {
        const section = el as TosiProductSection;
        section.scrollCallback = (progress: number, el: HTMLElement) => {
          const map = el.querySelector("tosi-map") as any;
          if (!map) return;
          // Travel from coast to coast in the middle 80% of the pin, with a
          // dramatic zoom-out at the midpoint.
          const move =
            progress <= 0.1
              ? 0
              : progress >= 0.9
              ? 1
              : ease((progress - 0.1) / 0.8);
          const zoomT = Math.abs(progress - 0.5) * 2;
          const zoom = 2 + zoomT * zoomT * 10;
          const lat = HMB.lat + (OULU.lat - HMB.lat) * move;
          const lng = HMB.lng + (OULU.lng - HMB.lng) * move;
          map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`;
        };
      },
    },
    div(
      { class: "media-scene" },
      mapBox({
        token: MAPBOX_TOKEN,
        coords: `${HMB.lat},${HMB.lng},12`,
        mapStyle: "mapbox://styles/mapbox/dark-v11",
        style: { pointerEvents: "none" },
      }),
      mediaOverlay("0,0.2", "Half Moon Bay"),
      mediaOverlay("0.45,0.55", "↑ zoom out, fly ↑"),
      mediaOverlay("0.8,1", "Oulu, Finland")
    )
  ),

  md(
    `## \`section.scrollCallback\` — custom integrations

When the built-in dispatchers don't fit, every section exposes a \`scrollCallback(progress, sectionEl)\` property. The engine calls it on every scroll tick with progress 0 → 1 across the section's pin.

\`\`\`ts
tosiProductSection({
  scroll: 400,
  apply(el) {
    const section = el as TosiProductSection
    section.scrollCallback = (progress, sectionEl) => {
      const map = sectionEl.querySelector('tosi-map')
      map.coords = interpolateCoords(progress)
    }
  }
}, mapBox({ token, coords, mapStyle }))
\`\`\`

The \`apply(el)\` key on the factory's props gets the live element handed to it once — that's the right spot to wire up JS-only configuration like callbacks. \`scrollCallback\` runs after the built-in dispatch loop, so it pairs cleanly with declarative animations in the same section.`
  ),

  // ===== THEME TRANSITION =====
  tosiProductSection(
    {
      scroll: 250,
      "theme-from": "midnight",
      "theme-to": "paper",
    },
    div(
      { class: "scene" },
      tosiInterpolator(
        { "data-scroll-animate": true, easing: "ease-in-out" },
        tosiWaypoint({
          progress: 0,
          style: { transform: "translateY(40px)", opacity: 0 },
        }),
        tosiWaypoint({
          progress: 0.4,
          style: { transform: "translateY(0px)", opacity: 1 },
        }),
        tosiWaypoint({
          progress: 1,
          style: { transform: "translateY(0px)", opacity: 1 },
        }),
        h2("Theme transition")
      ),
      p(
        "This section interpolates the theme from midnight to paper as you scroll through it. Page header, sticky bar, and footer all follow."
      ),
      span({ class: "pill" }, 'theme-from="midnight" theme-to="paper"')
    )
  ),

  md(
    `## Themes

A theme is a dictionary of CSS custom properties. Register a few on the engine instance, then point each section at one:

\`\`\`ts
app.themes = {
  midnight: { '--bg': '#08081a', '--fg': '#f0f0f5', '--accent': '#9be7ff' },
  paper:    { '--bg': '#f5f1e8', '--fg': '#1a1815', '--accent': '#7c3aed' },
}
app.defaultTheme = 'midnight'
\`\`\`

\`\`\`html
<tosi-product-section theme="midnight">…</tosi-product-section>
<tosi-product-section theme-from="midnight" theme-to="paper">…</tosi-product-section>
<tosi-product-section theme="paper">…</tosi-product-section>
\`\`\`

The engine writes the active section's resolved values to \`document.documentElement\` so anything cascading from \`:root\` re-themes in unison — page header, sticky bar, footer, all of it. Interpolated transitions blend colors through \`color-mix(in srgb, …)\`, numeric strings interpolate per-number, anything else steps at the midpoint.

Override \`app.themeTarget\` if you'd rather scope theme vars to a different element (e.g. the engine itself when nested).`
  ),

  // ===== PAPER LANDING + DUSK TRANSITION =====
  tosiProductSection(
    { scroll: 100, theme: "paper" },
    div(
      { class: "scene" },
      h2("Paper"),
      p("Light theme settled. The chrome above and below switched too."),
      span({ class: "pill" }, "theme=paper")
    )
  ),

  tosiProductSection(
    {
      scroll: 200,
      "theme-from": "paper",
      "theme-to": "rose",
    },
    div(
      { class: "scene" },
      h2("Dusk"),
      p(
        "And back the other way. The transition is just a section with two themes."
      ),
      span({ class: "pill" }, 'theme-from="paper" theme-to="rose"')
    )
  ),

  // ===== EMBEDDED VERTICAL =====
  div(
    { class: "embed-host" },
    h2("Nested scroll engines"),
    p(
      "A tosi-product inside any scrollable container detects its scroll parent automatically. It works the same in a 60vh card as on the whole page."
    ),
    div(
      { class: "embed-frame scroll-y" },
      tosiProduct(
        ...["Hero", "Intro", "Reveal", "Theme", "Done"].map((label, i, arr) =>
          tosiProductSection(
            {
              scroll: 80,
              theme: ["midnight", "forest", "paper", "rose", "midnight"][i],
            },
            div(
              { class: "inner-scene" },
              tosiInterpolator(
                { "data-scroll-animate": true, easing: "ease-in-out" },
                tosiWaypoint({
                  progress: 0,
                  style: {
                    opacity: i === 0 ? 1 : 0,
                    transform: "translateY(20px)",
                  },
                }),
                tosiWaypoint({
                  progress: 0.4,
                  style: { opacity: 1, transform: "translateY(0)" },
                }),
                tosiWaypoint({
                  progress: 1,
                  style: {
                    opacity: i === arr.length - 1 ? 1 : 0.85,
                    transform: "translateY(0)",
                  },
                }),
                elements.h3(label)
              ),
              p(
                `Inner section ${i + 1} of ${
                  arr.length
                }. The inner engine drives its own scroll inside the card.`
              )
            )
          )
        )
      )
    )
  ),

  // ===== EMBEDDED HORIZONTAL (follower mode) =====
  tosiProductSection(
    { scroll: 250, theme: "rose" },
    div(
      {
        class: "embed-host",
        style: { padding: "2rem 1rem", background: "transparent" },
      },
      h2("Horizontal nested engine"),
      p(
        "This section pins. Inside the pin, a horizontal tosi-product in follower mode — its panels slide as the outer's pin progress advances."
      ),
      div(
        { class: "embed-frame", style: { height: "55vh" } },
        tosiProduct(
          { direction: "horizontal" },
          ...[
            {
              name: "tosijs",
              desc: "Web components + proxy state.",
              bg: "#1a3a4a",
            },
            {
              name: "tosijs-ui",
              desc: "UI components that respect the DOM.",
              bg: "#3a3a1a",
            },
            {
              name: "tosijs-3d",
              desc: "BabylonJS, declaratively.",
              bg: "#3a1a3a",
            },
            { name: "tosijs-product", desc: "You are here.", bg: "#1a1a3a" },
          ].map((card) =>
            tosiProductSection(
              { scroll: 100 },
              div(
                { class: "h-card", style: { background: card.bg } },
                elements.h3(card.name),
                p(card.desc)
              )
            )
          )
        )
      )
    )
  ),

  md(
    `## Nested engines

A \`<tosi-product>\` inside any scrollable parent auto-detects the parent on connect and listens to it instead of the window. That covers the vertical card above — it just works.

A \`<tosi-product>\` placed inside a \`<tosi-product-section>\` is different: the parent section is already pinned and owns the scroll for its slot of runway, so the inner engine runs in **follower mode**. It tags itself \`data-scroll-animate\` and exposes \`setScrollProgress(progress)\` — the parent's pin progress drives the inner's stack translation. This is what makes the horizontal panels above slide.

\`\`\`html
<tosi-product-section scroll="250">
  <tosi-product direction="horizontal">
    <tosi-product-section scroll="100">Panel 1</tosi-product-section>
    <tosi-product-section scroll="100">Panel 2</tosi-product-section>
  </tosi-product>
</tosi-product-section>
\`\`\`

Use \`--tosi-view-size\` to size panels to the inner host (not the document viewport):

\`\`\`css
.h-card { width: var(--tosi-view-size, 100vw); }
\`\`\``
  ),

  // ===== CTA =====
  md(
    `## Get started

\`\`\`html
<script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
\`\`\`

Drop the IIFE into any page — \`tosijs\`, \`tosijs-ui\`, and \`tosijs-product\` are all bundled. Or install from npm:

\`\`\`bash
bun add tosijs-product tosijs tosijs-ui
\`\`\`

Then compose your scenes in HTML.`
  )
) as TosiProduct;

app.themes = themes;
app.defaultTheme = "midnight";

// === Mount ==================================================================
document.body.appendChild(pageHeader);
document.body.appendChild(stickyHeader);
document.body.appendChild(app);
document.body.appendChild(pageFooter);

// === Sticky header progress label ===========================================
window.addEventListener(
  "scroll",
  () => {
    requestAnimationFrame(() => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docH > 0 ? Math.round((window.scrollY / docH) * 100) : 0;
      stickyProgressLabel.textContent = `${pct}%`;
    });
  },
  { passive: true }
);
