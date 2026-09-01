# tosijs-product

<!--{ "pin": "top", "order": 1, "layout": "full-width", "headTitle": "tosijs-product — cinematic, scroll-driven product pages in HTML", "description": "Build Apple-style, scroll-linked product stories with declarative web components. tosijs-product pins sections and drives Lottie, video (WebP mosaics), BabylonJS 3D, and CSS interpolation from scroll position — authored in plain HTML.", "keywords": ["scrollytelling", "scroll animation", "product page", "web components", "custom elements", "tosijs", "lottie", "webp mosaic", "babylonjs", "scroll-linked animation", "cinematic landing page", "apple-style scrolling"] }-->

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, "Apple-style" product stories with minimal code. It unifies Lottie, video, BabylonJS 3D, Mapbox flights, themes, and declarative CSS interpolation under a single scroll engine.

_This page is the demo._ Scroll — the hero below is a live `<tosi-product>` engine pinned to this doc's scroll container, authored entirely in the Markdown you're reading.

<style>
.doc-content:has(.tp-hero) { --doc-content-padding: 0; overflow: visible !important; }
.doc-content:has(.tp-hero) > :not(.tp-hero):not(style) { max-width: 44rem; margin-inline: auto; padding-inline: 1.25rem; box-sizing: border-box; }
.tp-hero h1, .tp-hero h2, .tp-hero h3 { color:var(--fg); border:none; line-height:1.08; letter-spacing:-.01em; }
.tp-hero .media-overlay h1, .tp-hero .media-overlay h2 { color:#fff; }
.doc-content:has(.tp-hero) > h1, .doc-content:has(.tp-hero) > h2, .doc-content:has(.tp-hero) > h3 { color:var(--text-color); border:none; letter-spacing:-.01em; margin:1.6em 0 .4em; }
.tp-hero { --bg:var(--background,#08081a); --fg:var(--text-color,#f0f0f5); --muted:color-mix(in srgb, var(--text-color,#f0f0f5) 62%, var(--background,#08081a)); --accent:var(--brand-color,#9be7ff); --surface:color-mix(in srgb, var(--text-color,#f0f0f5) 8%, transparent); --border:color-mix(in srgb, var(--text-color,#f0f0f5) 16%, transparent); }
.tp-hero .scene { padding: clamp(4rem, 15vh, 11rem) 2rem; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; background:var(--bg); color:var(--fg); }
.tp-hero .scene h1 { font-size: clamp(2.5rem, 9vw, 6rem); margin:0 0 .6em; font-weight:800; letter-spacing:-.02em; }
.tp-hero .scene h2 { font-size: clamp(2rem, 6vw, 4rem); margin:0 0 .4em; font-weight:800; }
.tp-hero .scene p { font-size: clamp(1rem, 1.6vw, 1.25rem); color:var(--muted); max-width:580px; margin:0; }
.tp-hero .pill { display:inline-block; margin-top:1.5em; background:var(--surface); border:1px solid var(--border); color:var(--accent); font-family:monospace; font-size:.85rem; padding:.5em 1.2em; border-radius:999px; }
.tp-hero .feature-list { display:flex; flex-direction:column; align-items:flex-start; gap:.5em; max-width:580px; padding:0 1.5rem; }
.tp-hero .feature-list h2, .tp-hero .feature-list p { text-align:left; }
.tp-hero .feature-row { font-size:1.05rem; background:var(--surface); border:1px solid var(--border); border-radius:10px; padding:.7em 1.1em; margin-top:.3em; font-family:monospace; color:var(--fg); }
.tp-hero .media-scene { position:relative; height:var(--tosi-view-size, 100vh); overflow:hidden; background:#0a0a12; }
.tp-hero .media-scene > video, .tp-hero .media-scene > tosi-filmstrip, .tp-hero .media-scene > tosi-3d, .tp-hero .media-scene > tosi-map { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
.tp-hero .media-scene > tosi-filmstrip::part(canvas) { object-fit:cover; }
.tp-hero .media-scene > tosi-map { pointer-events:none; }
.tp-hero .media-scene.lottie { background:radial-gradient(ellipse at center, #14142a 0%, #0a0a12 100%); }
.tp-hero .media-scene > tosi-lottie { position:absolute; left:50%; top:50%; transform:translate(-50%,-50%); width:min(70vh,60vw); height:min(70vh,60vw); }
.tp-hero .media-overlay { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; pointer-events:none; text-align:center; color:#fff; padding:2rem; }
.tp-hero .media-overlay h2 { font-size:clamp(2rem, 6vw, 4rem); margin:0 0 .3em; font-weight:800; filter:drop-shadow(0 2px 12px rgba(0,0,0,.85)); }
.tp-hero .media-overlay p { color:#ddd; max-width:560px; margin:0; font-size:clamp(1rem, 1.6vw, 1.2rem); filter:drop-shadow(0 1px 6px rgba(0,0,0,.9)); }
</style>
<div class="tp-hero">
<tosi-product>
<tosi-product-section scroll="60">
<div class="scene">
<tosi-interpolator data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" style="transform: scale(1) translateY(0em)"></tosi-waypoint>
<tosi-waypoint progress="1" style="transform: scale(1.4) translateY(0.2em)"></tosi-waypoint>
<h1>tosijs-product</h1>
</tosi-interpolator>
<p>Build cinematic product pages with HTML.</p>
<div class="pill">scroll ↓</div>
</div>
</tosi-product-section>
<tosi-product-section scroll="80">
<div class="scene">
<tosi-interpolator data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform: translateY(60px) scale(.95)"></tosi-waypoint>
<tosi-waypoint progress="0.4" style="opacity:1; transform: translateY(0px) scale(1)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform: translateY(0px) scale(1)"></tosi-waypoint>
<h2>Interpolator</h2>
</tosi-interpolator>
<p>A waypoint timeline for any CSS property. Set keyframes by progress and let the engine drive the rest.</p>
<div class="pill">&lt;tosi-interpolator&gt;</div>
</div>
</tosi-product-section>
<tosi-product-section scroll="180">
<div class="scene">
<div class="feature-list">
<h2>Staged reveal</h2>
<p>Multiple interpolators in one section, each scoped to a slice of progress with data-scroll-range:</p>
<tosi-interpolator data-scroll-animate data-scroll-range="0.05,0.2" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform: translateX(-40px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<div class="feature-row">✓ Sticky window pins the engine</div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.2,0.35" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform: translateX(-40px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<div class="feature-row">✓ Stack translates as you scroll</div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.35,0.5" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform: translateX(-40px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<div class="feature-row">✓ Sections pin then exit</div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.5,0.65" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform: translateX(-40px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:1; transform: translateX(0px)"></tosi-waypoint>
<div class="feature-row">✓ Sub-range staging schedules the rest</div>
</tosi-interpolator>
</div>
</div>
</tosi-product-section>
<tosi-product-section scroll="300">
<div class="media-scene">
<video src="/agent-owl.mp4" data-scroll-animate="currentTime" muted playsinline preload="auto"></video>
<tosi-interpolator data-scroll-animate data-scroll-range="0,0.4" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Scrub video</h2><p>A native <code>&lt;video&gt;</code> with <code>data-scroll-animate="currentTime"</code> — the section maps scroll progress to <code>video.currentTime</code>.</p></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.5,1" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Frame-perfect scrubbing, no plugin</h2></div>
</tosi-interpolator>
</div>
</tosi-product-section>
<tosi-product-section scroll="300">
<div class="media-scene">
<tosi-filmstrip src="/agent-owl_10x10_100.jpg" cols="10" rows="10" total="100" data-scroll-animate></tosi-filmstrip>
<tosi-interpolator data-scroll-animate data-scroll-range="0,0.4" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>100 frames. One image.</h2><p>Zero video decode. Instant seeking. A WebP/JPG mosaic blitted to a canvas.</p></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.5,1" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Hardware-accelerated canvas blits</h2></div>
</tosi-interpolator>
</div>
</tosi-product-section>
<tosi-product-section scroll="250">
<div class="media-scene lottie">
<tosi-lottie src="/tosi-platform.json" data-scroll-animate="lottie"></tosi-lottie>
<tosi-interpolator data-scroll-animate data-scroll-range="0,0.5" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Vector animation</h2><p>Bodymovin / Lottie JSON, scrubbed frame-by-frame by scroll.</p></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.5,1" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Frame-perfect at every zoom</h2></div>
</tosi-interpolator>
</div>
</tosi-product-section>
<tosi-product-section scroll="350">
<div class="media-scene">
<tosi-3d src="/macbook_neo.glb" hero-light fov="0.6" clear-color="transparent" data-scroll-animate>
<tosi-scroll-camera data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" alpha="-1.57" beta="1.2" radius="110" target-y="10"></tosi-waypoint>
<tosi-waypoint progress="0.5" alpha="0" beta="1.0" radius="70" target-y="10"></tosi-waypoint>
<tosi-waypoint progress="1" alpha="1.57" beta="1.55" radius="76" target-y="10"></tosi-waypoint>
</tosi-scroll-camera>
</tosi-3d>
<tosi-interpolator data-scroll-animate data-scroll-range="0,0.4" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>MacBook Neo.</h2><p>A glTF model, lit and framed by scroll — <code>&lt;tosi-3d&gt;</code> driven by a <code>&lt;tosi-scroll-camera&gt;</code>.</p></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.5,1" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Every angle, scroll-driven.</h2></div>
</tosi-interpolator>
</div>
</tosi-product-section>
<tosi-product-section scroll="400">
<div class="media-scene">
<tosi-map token="pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA" coords="37.4636,-122.4286,12" map-style="mapbox://styles/mapbox/satellite-streets-v12">
<tosi-scroll-map data-scroll-animate easing="ease-in-out">
<tosi-waypoint progress="0" coords="37.4636,-122.4286,12"></tosi-waypoint>
<tosi-waypoint progress="0.2" coords="37.4636,-122.4286,12"></tosi-waypoint>
<tosi-waypoint progress="0.5" coords="51,0,2"></tosi-waypoint>
<tosi-waypoint progress="0.8" coords="65.0121,25.4651,12"></tosi-waypoint>
<tosi-waypoint progress="1" coords="65.0121,25.4651,12"></tosi-waypoint>
</tosi-scroll-map>
</tosi-map>
<tosi-interpolator data-scroll-animate data-scroll-range="0,0.2" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Half Moon Bay</h2><p>A Mapbox fly-through, waypoint-driven by <code>&lt;tosi-scroll-map&gt;</code> — no scroll callbacks.</p></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.4,0.6" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>↑ zoom out, fly ↑</h2></div>
</tosi-interpolator>
<tosi-interpolator data-scroll-animate data-scroll-range="0.85,1" easing="ease-in-out">
<tosi-waypoint progress="0" style="opacity:0; transform:translateY(20px)"></tosi-waypoint>
<tosi-waypoint progress="0.5" style="opacity:1; transform:translateY(0px)"></tosi-waypoint>
<tosi-waypoint progress="1" style="opacity:0; transform:translateY(-20px)"></tosi-waypoint>
<div class="media-overlay"><h2>Oulu, Finland</h2></div>
</tosi-interpolator>
</div>
</tosi-product-section>
</tosi-product>
</div>

[**View the standalone demo**](https://tonioloewald.github.io/tosijs-product/) · all the scenes below run the same engine.

## Architecture in one paragraph

`<tosi-product>` is a **scroll engine**. It owns the page (or any scrollable region) it lives in: it computes a runway from its sections, hosts a sticky viewport-sized window in shadow DOM, and translates an absolute-positioned stack as you scroll. Each `<tosi-product-section>` declares a pin duration via `scroll`; during pin the section sits motionless at the viewport top while interpolators run, then it scrolls out at 1:1 and yields to the next. Themes are dictionaries of CSS custom properties — the engine writes the active section's resolved values to `:root`, so external siblings (page header, sticky overlay, footer) re-theme through the cascade.

## Key components

- **`tosi-product`** — the scroll engine. Owns the runway, the sticky window, the stack translation, the theme registry. A `tosi-product` placed inside another `tosi-product`'s section automatically runs in **follower mode**, driven by the parent section's pin progress (so you can nest a horizontal engine inside a vertical one).
- **`tosi-product-section`** — a slotted container with `scroll` (pin duration in viewport %), `theme` / `theme-from` / `theme-to`, and a `direction` inherited from its engine.
- **`tosi-product-header`** — a sticky overlay header that slides in once `window.scrollY > threshold`. Inherits theme via the CSS cascade.
- **`tosi-interpolator`** + **`tosi-waypoint`** — declarative CSS interpolation between progress keyframes.
- **`tosi-filmstrip`** — frame-based animator using a WebP/PNG mosaic grid for buttery-smooth video-style scrubbing.
- **`tosi-prism`** — Prism-highlighted code block (lazy-loads PrismJS from CDN). Also exports `loadPrism` and `highlightCodeBlocks` helpers for re-highlighting other rendered HTML (e.g. markdown viewer output).

## Getting started

### Pure HTML (zero JS orchestration)

The IIFE build is self-contained — a single script tag gives you `tosijs`, `tosijsUi`, and `tosijsProduct` as globals, with all custom elements registered automatically:

```xml
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>My Product</title>
    <style>
      body {
        margin: 0;
      }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/tosijs-product@0.7.0/dist/index.js"></script>
  </head>
  <body>
    <tosi-product>
      <tosi-product-section scroll="200">
        <tosi-interpolator data-scroll-animate easing="ease-in-out">
          <tosi-waypoint
            progress="0"
            style="opacity: 0; transform: translateY(50px)"
          ></tosi-waypoint>
          <tosi-waypoint
            progress="0.5"
            style="opacity: 1; transform: translateY(0px)"
          ></tosi-waypoint>
          <tosi-waypoint
            progress="1"
            style="opacity: 1; transform: scale(1.2)"
          ></tosi-waypoint>
          <h1 style="text-align: center;">Pinned for 2× viewport.</h1>
        </tosi-interpolator>
      </tosi-product-section>
    </tosi-product>
  </body>
</html>
```

### Modern web app (ESM)

Install from npm using bun, npm or whatever package manager you prefer:

```bash
bun add tosijs-product tosijs tosijs-ui
```

And compose your pages using typescript, javascript, or HTML.

```typescript
import {
  tosiProduct,
  tosiProductSection,
  tosiInterpolator,
  tosiWaypoint,
} from "tosijs-product";

const app = tosiProduct(
  tosiProductSection(
    { scroll: 200 },
    tosiInterpolator(
      { "data-scroll-animate": true, easing: "ease-in-out" },
      tosiWaypoint({
        progress: 0,
        style: "opacity: 0; transform: translateY(50px)",
      }),
      tosiWaypoint({
        progress: 0.5,
        style: "opacity: 1; transform: translateY(0px)",
      }),
      tosiWaypoint({ progress: 1, style: "opacity: 1; transform: scale(1.2)" }),
      document.createElement("h1")
    )
  )
);

document.body.append(app);
```

## The `scroll` attribute

`scroll` on a section is its **pin duration**, expressed as a percentage of the viewport. `scroll="200"` means "pin this section for 2× viewport of scroll." When pin progress reaches 1, the section enters its **exit phase** and scrolls out at 1:1 over its own height. So total scroll claimed = `(scroll / 100) * viewport + naturalSize`.

## Themes

Register themes (each is a dictionary of CSS custom properties) and reference them from sections:

```typescript
const app = tosiProduct(
  tosiProductSection({ scroll: 100, theme: "midnight" } /* ... */),
  tosiProductSection(
    { scroll: 200, "theme-from": "midnight", "theme-to": "paper" } /* ... */
  ),
  tosiProductSection({ scroll: 100, theme: "paper" } /* ... */)
);

app.themes = {
  midnight: { "--bg": "#08081a", "--fg": "#f0f0f5", "--accent": "#9be7ff" },
  paper: { "--bg": "#f5f1e8", "--fg": "#1a1815", "--accent": "#7c3aed" },
};
app.defaultTheme = "midnight";
```

The transition section interpolates its CSS variables (color values use `color-mix(in srgb, …)`) over its pin progress, and writes them to `document.documentElement`. Anything cascading from `:root` — including a `<tosi-product-header>` overlay outside the engine — re-themes in unison.

## Frame-based animation

Standard video scrubbing (`video.currentTime`) often stutters because decoders aren't designed for random-access seeking. The `tosi-mosaic` CLI converts a video to a single WebP mosaic grid, and `<tosi-filmstrip>` scrubs through it using a hardware-accelerated canvas. (The CLI needs `ffmpeg` and `ffprobe` on your PATH — macOS: `brew install ffmpeg`.)

```bash
bunx tosi-mosaic my-video.mp4 --frames 100 --width 1280
```

Produces `my-video_10x10_100.webp` (the filename encodes grid + total frames):

```xml
<tosi-filmstrip
  src="my-video_10x10_100.webp"
  data-scroll-animate
></tosi-filmstrip>
```

A grid (rather than a single long strip) keeps dimensions inside the browser's max image size (commonly 16,384px) while delivering all frames in one request.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
