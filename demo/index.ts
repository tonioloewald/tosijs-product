import {
  tosiProduct,
  tosiProductSection,
  tosiProductHeader,
  TosiProduct,
  TosiProductSection,
} from "../src/tosi-product";
import { tosiInterpolator, tosiWaypoint } from "../src/tosi-interpolator";
import { tosiFilmstrip } from "../src/tosi-filmstrip";
import { tosiCode } from "../src/tosi-code";
import { markdownViewer, bodymovinPlayer, mapBox } from "tosijs-ui";
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
  .intro tosi-md code {
    background: var(--code-bg); padding: 0.12em 0.4em;
    border-radius: 4px; font-size: 0.9em;
    font-family: Consolas, Monaco, "Courier New", monospace;
  }

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
  .media-scene > tosi-map {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: cover; display: block;
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
    a({ href: "https://tosijs.net" }, "tosijs"),
    a({ href: "#" }, "Examples")
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
const md = (markdown: string) =>
  div({ class: "intro" }, markdownViewer(markdown));

// Fades the overlay text in then out over a sub-range of section progress.
const mediaOverlay = (
  range: string,
  title: string,
  subtitle?: string
) =>
  tosiInterpolator(
    { "data-scroll-animate": true, "data-scroll-range": range, easing: "ease-in-out" },
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

  // ===== INTERPOLATOR BASICS =====
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
      p("A waypoint timeline for any CSS property. Set keyframes by progress and let the engine drive the rest."),
      span({ class: "pill" }, "<tosi-interpolator>")
    )
  ),

  md(
    `## Declarative interpolation

\`<tosi-interpolator>\` interpolates inline styles between \`<tosi-waypoint>\` keyframes as the section's progress moves from 0 to 1. Numbers in transforms, opacity, colors — anything CSS understands.

\`\`\`html
<tosi-interpolator data-scroll-animate>
  <tosi-waypoint progress="0" style="opacity: 0"></tosi-waypoint>
  <tosi-waypoint progress="1" style="opacity: 1"></tosi-waypoint>
  <div>I fade in.</div>
</tosi-interpolator>
\`\`\``
  ),

  // ===== STAGED REVEAL =====
  tosiProductSection(
    { scroll: 300, theme: "midnight" },
    div(
      { class: "scene" },
      div(
        { class: "feature-list" },
        h2("Staged reveal"),
        p("Multiple interpolators in one section, each scoped to a slice of progress with data-scroll-range:"),
        stagedRow("Sticky window pins the engine", 0.05, 0.2),
        stagedRow("Stack translates as you scroll", 0.2, 0.35),
        stagedRow("Sections pin then exit", 0.35, 0.5),
        stagedRow("Sub-range staging schedules the rest", 0.5, 0.65)
      )
    )
  ),

  // ===== MEDIA INTRO =====
  md(
    `## Drive media with scroll

Interpolators handle CSS. For richer media — videos, vector animations, 3D scenes, maps — the engine forwards each section's progress to any descendant tagged with \`data-scroll-animate\`. The next few scenes show the built-in dispatchers in action.`
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
        "data-scroll-animate=\"currentTime\" maps progress to video.currentTime — frame-perfect scrubbing."
      ),
      mediaOverlay("0.5,1", "Native <video>, no plugin")
    )
  ),

  md(
    `## Filmstrip mosaics

Video decoders aren't built for random seeking — scrubbing real video stutters. \`<tosi-filmstrip>\` solves this by packing every frame into a single WebP mosaic that the engine renders on a canvas. Use the bundled \`bunx tosi-mosaic\` CLI to encode a clip.

\`\`\`html
<tosi-filmstrip
  src="agent-owl_10x10_100.webp"
  data-scroll-animate>
</tosi-filmstrip>
\`\`\`

Grid dimensions and frame count are auto-detected from the filename suffix (\`_COLSxROWS_TOTAL\`).`
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

  // ===== LOTTIE =====
  md(
    `## Lottie / Bodymovin

Scrub Bodymovin (Lottie) animations the same way as video. Tag a \`<tosi-lottie>\` with \`data-scroll-animate="lottie"\` and the engine drives it via \`animation.goToAndStop()\`. Pure SVG, vector-perfect at any zoom.

\`\`\`html
<tosi-lottie
  src="animation.json"
  data-scroll-animate="lottie">
</tosi-lottie>
\`\`\``
  ),

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

  // ===== MAPBOX =====
  md(
    `## Mapbox fly-around

For more bespoke scroll-driven behavior, every section exposes a \`scrollCallback(progress, el)\` property. Below, the section drives a \`<tosi-map>\` — interpolating lat/lng + zoom across the section's pin to fly between two points on Earth.

\`\`\`ts
tosiProductSection({
  scroll: 400,
  apply(section) {
    section.scrollCallback = (p, el) => {
      const map = el.querySelector('tosi-map')
      map.coords = interpolateCoords(p)
    }
  }
}, mapBox({ token, coords, mapStyle }))
\`\`\``
  ),

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
      p("This section interpolates the theme from midnight to paper as you scroll through it. Page header, sticky bar, and footer all follow."),
      span({ class: "pill" }, 'theme-from="midnight" theme-to="paper"')
    )
  ),

  tosiProductSection(
    { scroll: 100, theme: "paper" },
    div(
      { class: "scene" },
      h2("Paper"),
      p("Light theme settled. The chrome above and below switched too."),
      span({ class: "pill" }, "theme=paper")
    )
  ),

  md(
    `## Theming via CSS variables

Themes are dictionaries of CSS custom properties. The engine writes the active section's resolved values to \`document.documentElement\`, so anything cascading from \`:root\` — including the page header, the sticky overlay, and the footer — re-themes in unison.

For interpolated sections, color values blend through \`color-mix(in srgb, ...)\`; numeric strings interpolate per-number; everything else steps at the midpoint.

\`\`\`html
<tosi-product-section
  theme-from="midnight"
  theme-to="paper">
  ...
</tosi-product-section>
\`\`\``
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
      p("And back the other way. The transition is just a section with two themes."),
      span({ class: "pill" }, 'theme-from="paper" theme-to="rose"')
    )
  ),

  // ===== EMBEDDED VERTICAL =====
  div(
    { class: "embed-host" },
    h2("Nested scroll engines"),
    p("A tosi-product inside any scrollable container detects its scroll parent automatically. It works the same in a 60vh card as on the whole page."),
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
                  style: { opacity: i === 0 ? 1 : 0, transform: "translateY(20px)" },
                }),
                tosiWaypoint({
                  progress: 0.4,
                  style: { opacity: 1, transform: "translateY(0)" },
                }),
                tosiWaypoint({
                  progress: 1,
                  style: { opacity: i === arr.length - 1 ? 1 : 0.85, transform: "translateY(0)" },
                }),
                elements.h3(label)
              ),
              p(`Inner section ${i + 1} of ${arr.length}. Note: this engine has its own theme set per section, but it doesn't write to :root — it would override the outer engine.`)
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
      { class: "embed-host", style: { padding: "2rem 1rem", background: "transparent" } },
      h2("Horizontal nested engine"),
      p("This section pins. Inside the pin, a horizontal tosi-product in follower mode — its panels slide as the outer's pin progress advances."),
      div(
        { class: "embed-frame", style: { height: "55vh" } },
        tosiProduct(
          { direction: "horizontal" },
          ...[
            { name: "tosijs", desc: "Web components + proxy state.", bg: "#1a3a4a" },
            { name: "tosijs-ui", desc: "UI components that respect the DOM.", bg: "#3a3a1a" },
            { name: "tosijs-3d", desc: "BabylonJS, declaratively.", bg: "#3a1a3a" },
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

// Touch tosiCode so the import isn't tree-shaken; we'll use it later for
// inline highlighted snippets in scene scenes.
void tosiCode;
