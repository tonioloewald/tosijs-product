// TODO: Mapbox and BabylonJS sections still require JS callbacks.
// Goal is 100% declarative — needs tosi-interpolator to support writing
// interpolated values as properties/attributes on target elements (not just
// CSS styles), and tosi-map/tosi-3d to expose more declarative config.
// Waiting on tosijs-ui component features to make this possible.

import {
  tosiProduct,
  tosiProductSection,
  tosiScrollMapper,
  tosiFilmstrip,
  tosiWaypoint,
  tosiInterpolator,
  tosiScrollCamera,
  tosiCode,
} from "../src/index";
import { markdownViewer, bodymovinPlayer, b3d, mapBox } from "tosijs-ui";
import { elements } from "tosijs";

const style = document.createElement("style");
style.textContent = `
  *, *::before, *::after { box-sizing: border-box; }
  body {
    margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  tosi-product-section { display: block !important; width: 100% !important; position: relative !important; }
  tosi-lottie, tosi-3d, tosi-map, video, tosi-filmstrip {
    position: absolute !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important; height: 100vh !important;
    object-fit: cover !important; display: block !important;
  }
  .overlay {
    position: absolute !important; top: 0; left: 0;
    width: 100vw; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 10;
  }
  .hero-text {
    font-size: clamp(2rem, 8vw, 5rem); font-weight: 800; text-align: center;
    background: linear-gradient(to bottom, #fff, #999);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    padding: 0 20px; margin: 0;
    filter: drop-shadow(0 2px 12px rgba(0,0,0,0.8)) drop-shadow(0 0 40px rgba(0,0,0,0.6));
  }
  .hero { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; pointer-events: none; z-index: 10; }
  .hero h1 {
    font-size: clamp(2rem, 8vw, 6rem); font-weight: 800; text-align: center; margin: 0;
    background: linear-gradient(to bottom, #fff, #aaa);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }
  .hero p { font-size: clamp(1rem, 2.5vw, 1.5rem); text-align: center; color: #999; margin: 0.5em 0 0; max-width: 600px; padding: 0 20px; }
  .feature-text {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    pointer-events: none; z-index: 10;
  }
  .feature-text h2 { font-size: clamp(1.5rem, 5vw, 3.5rem); font-weight: 700; text-align: center; margin: 0; padding: 0 20px; }
  .feature-text p { font-size: clamp(0.875rem, 2vw, 1.25rem); text-align: center; color: #aaa; margin: 0.5em 0 0; max-width: 500px; padding: 0 20px; }
  .gradient-bg { position: absolute; inset: 0; z-index: 0; }
  .nested-scroll { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent; }
  .nested-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
  .nested-scroll::-webkit-scrollbar-track { background: transparent; }
  .nested-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 3px; }
`;
document.head.appendChild(style);

const { div, h1, h2, p, pre, code, span, video } = elements;
const ease = (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t);

// --- helpers ---

const overlay = (range: string, text: string, options: any = {}) =>
  tosiInterpolator(
    { "data-scroll-animate": "interpolator", "data-scroll-range": range },
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
    div({ class: "overlay", ...options }, h1({ class: "hero-text" }, text))
  );

const featureIntro = (
  title: string,
  description: string,
  codeText: string,
  bg = "#0a0a0a"
) =>
  tosiProductSection(
    { scroll: 250, style: { background: bg } },
    tosiInterpolator(
      { "data-scroll-animate": true, easing: "ease-in-out" },
      tosiWaypoint({
        progress: 0.0,
        style: { opacity: 0, transform: "translateY(60px)" },
      }),
      tosiWaypoint({
        progress: 0.3,
        style: { opacity: 1, transform: "translateY(0px)" },
      }),
      tosiWaypoint({
        progress: 0.7,
        style: { opacity: 1, transform: "translateY(0px)" },
      }),
      tosiWaypoint({
        progress: 1.0,
        style: { opacity: 0, transform: "translateY(-60px)" },
      }),
      div(
        { class: "feature-text", style: { flexDirection: "column" } },
        h2(title),
        p(description),
        ...(codeText ? [tosiCode({ language: "html" }, codeText)] : [])
      )
    )
  );

// --- data ---

const hmb = { lat: 37.4636, lng: -122.4286 };
const oulu = { lat: 65.0121, lng: 25.4651 };

// --- app ---

const app = tosiProduct(
  // ===== HERO =====
  tosiProductSection(
    { scroll: 150 },
    div({
      class: "gradient-bg",
      style: {
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #000 120%)",
      },
    }),
    tosiInterpolator(
      { "data-scroll-animate": true },
      tosiWaypoint({
        progress: 0.0,
        style: { opacity: 1, transform: "translateY(0px) scale(1)" },
      }),
      tosiWaypoint({
        progress: 0.8,
        style: { opacity: 0, transform: "translateY(-100px) scale(0.9)" },
      }),
      div(
        { class: "hero" },
        h1("tosijs-product"),
        p("Build scrolling pages that tell your product's story. With HTML.")
      )
    )
  ),

  // ===== 1. INTERPOLATOR =====
  featureIntro(
    "<tosi-interpolator>",
    "Scrolling is progress. Orchestrate layers with declarative waypoints — opacity, transforms, any CSS property.",
    `<tosi-interpolator data-scroll-animate>
  <tosi-waypoint progress="0.0" style="opacity: 0"></tosi-waypoint>
  <tosi-waypoint progress="0.5" style="opacity: 1"></tosi-waypoint>
  <tosi-waypoint progress="1.0" style="opacity: 0"></tosi-waypoint>
  <div>Your content here</div>
</tosi-interpolator>`,
    "#050510"
  ),

  tosiProductSection(
    { scroll: 300, style: { background: "#0a0a0a" } },
    tosiInterpolator(
      { "data-scroll-range": "0,0.5", easing: "ease-in-out" },
      tosiWaypoint({
        progress: 0.0,
        style: { opacity: 0, transform: "translateX(-80px)" },
      }),
      tosiWaypoint({
        progress: 0.4,
        style: { opacity: 1, transform: "translateX(0px)" },
      }),
      tosiWaypoint({
        progress: 1.0,
        style: { opacity: 0, transform: "translateX(-80px)" },
      }),
      div(
        {
          class: "feature-text",
          style: {
            flexDirection: "column",
            alignItems: "flex-start",
            paddingLeft: "10vw",
          },
        },
        h2("Scroll Ranges"),
        p("Constrain animations to any portion of a section's scroll.")
      )
    ),
    tosiInterpolator(
      { "data-scroll-range": "0.5,1", easing: "ease-in-out" },
      tosiWaypoint({
        progress: 0.0,
        style: { opacity: 0, transform: "translateX(80px)" },
      }),
      tosiWaypoint({
        progress: 0.5,
        style: { opacity: 1, transform: "translateX(0px)" },
      }),
      tosiWaypoint({
        progress: 1.0,
        style: { opacity: 0, transform: "translateX(80px)" },
      }),
      div(
        {
          class: "feature-text",
          style: {
            flexDirection: "column",
            alignItems: "flex-end",
            paddingRight: "10vw",
          },
        },
        h2("Layer by Layer"),
        p("Choreograph multiple elements, each with its own timing.")
      )
    )
  ),

  // ===== 2. VIDEO SCRUBBING =====
  featureIntro(
    "Video Scrubbing",
    'Scrub any video frame-by-frame via scroll position. Just add data-scroll-animate="currentTime" — you\'ll want a fast server or CDN.',
    `<video src="clip.mp4" data-scroll-animate="currentTime" muted playsinline></video>`
  ),

  tosiProductSection(
    { scroll: 300, style: { backgroundColor: "#000" } },
    video({
      src: "demo/assets/agent-owl.mp4",
      "data-scroll-animate": "currentTime",
      muted: true,
      playsinline: true,
      preload: "auto",
    }),
    overlay("0.1, 0.5", "Scrub any video. Frame by frame.")
  ),

  // ===== 3. FILMSTRIP MOSAIC =====
  featureIntro(
    "Filmstrip Mosaic",
    "Convert video into a single mosaic image. No video decode, instant seeking, works everywhere. Use the tosi-mosaic CLI to generate.",
    `<tosi-filmstrip
  src="clip_10x10_100.jpg"
  cols="10" rows="10" total="100"
  data-scroll-animate
></tosi-filmstrip>`
  ),

  tosiProductSection(
    { scroll: 300, style: { backgroundColor: "#000" } },
    tosiFilmstrip({
      src: "demo/assets/agent-owl_10x10_100.jpg",
      cols: 10,
      rows: 10,
      total: 100,
      "data-scroll-animate": "true",
    }),
    overlay("0.1, 0.9", "100 frames. One image. Zero stutter.")
  ),

  // ===== 4. MAPBOX =====
  featureIntro(
    "Mapbox Integration",
    "Travel the world with scroll-linked map navigation. Zoom out, pan across continents, zoom back in.",
    `<tosi-scroll-mapper>
  <tosi-map token="pk.ey..."
    coords="37.46,-122.43,12"
    map-style="mapbox://styles/mapbox/dark-v11">
  </tosi-map>
</tosi-scroll-mapper>`
  ),

  tosiProductSection(
    { scroll: 500, style: { backgroundColor: "#fff" } },
    tosiScrollMapper(
      {
        scrollCallback(progress: number) {
          const map = (this as any).querySelector("tosi-map");
          if (!map) return;
          let moveP = 0;
          if (progress > 0.1 && progress < 0.9) {
            moveP = ease((progress - 0.1) / 0.8);
          } else if (progress >= 0.9) {
            moveP = 1;
          }
          const zp = Math.abs(progress - 0.5) * 2;
          const zoom = 2 + zp * zp * 10;
          const lat = hmb.lat + (oulu.lat - hmb.lat) * moveP;
          const lng = hmb.lng + (oulu.lng - hmb.lng) * moveP;
          map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`;
        },
      },
      mapBox({
        token:
          "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA",
        coords: `${hmb.lat},${hmb.lng},12`,
        mapStyle: "mapbox://styles/mapbox/dark-v11",
        style: { width: "100%", height: "100%", pointerEvents: "none" },
      })
    ),
    overlay("0, 0.2", "Half Moon Bay"),
    overlay("0.8, 1.0", "Oulu")
  ),

  // ===== 5. BABYLONJS 3D =====
  featureIntro(
    "3D Scenes",
    "Animate BabylonJS scenes with scroll-driven camera waypoints. Load any GLB/glTF model.",
    `<tosi-scroll-camera data-scroll-animate easing="ease-in-out">
  <tosi-waypoint progress="0" alpha="-1.57" radius="110"></tosi-waypoint>
  <tosi-waypoint progress="1" alpha="1.57" radius="76"></tosi-waypoint>
</tosi-scroll-camera>`
  ),

  tosiProductSection(
    { scroll: 400, style: { backgroundColor: "#111" } },
    overlay("0, 0.5", "MacBook Neo."),
    overlay("0.5, 1.0", "Every angle. Pure elegance."),
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
        element.loadScene("demo/assets/", "macbook_neo.glb");
      },
    }),
    tosiScrollCamera(
      { "data-scroll-animate": true, easing: "ease-in-out" },
      tosiWaypoint({ progress: 0, alpha: -1.57, beta: 1.2, radius: 110 }),
      tosiWaypoint({ progress: 0.5, alpha: 0, beta: 1.0, radius: 70 }),
      tosiWaypoint({ progress: 1, alpha: 1.57, beta: 1.55, radius: 76 })
    )
  ),

  // ===== 6. LOTTIE =====
  featureIntro(
    "Lottie Animations",
    "Scrub Lottie/Bodymovin animations with scroll progress. Frame-perfect control over vector animations.",
    `<tosi-lottie
  src="animation.json"
  data-scroll-animate="lottie"
></tosi-lottie>`
  ),

  tosiProductSection(
    {
      scroll: 200,
      style: { backgroundColor: "#000" },
    },
    bodymovinPlayer({
      src: "demo/assets/tosi-platform.json",
      "data-scroll-animate": "lottie",
      config: { renderer: "svg", autoplay: false, loop: false },
    }),
    overlay("0, 0.5", "Scroll-driven vector art."),
    overlay("0.5, 1.0", "Any Lottie animation. Zero code.")
  ),

  // ===== 7. ONE SCRIPT TAG =====
  tosiProductSection(
    {
      scroll: 200,
      style: {
        background: "radial-gradient(ellipse at center, #1a1a2e 0%, #000 70%)",
      },
    },
    tosiInterpolator(
      { "data-scroll-animate": true, easing: "ease-in-out" },
      tosiWaypoint({
        progress: 0.0,
        style: { opacity: 0, transform: "translateY(40px)" },
      }),
      tosiWaypoint({
        progress: 0.3,
        style: { opacity: 1, transform: "translateY(0px)" },
      }),
      tosiWaypoint({
        progress: 0.7,
        style: { opacity: 1, transform: "translateY(0px)" },
      }),
      tosiWaypoint({
        progress: 1.0,
        style: { opacity: 0, transform: "translateY(-40px)" },
      }),
      div(
        { class: "feature-text", style: { flexDirection: "column" } },
        h2("One Script Tag"),
        p(
          "The IIFE build includes tosijs, tosijs-ui, and tosijs-product. Load it from a CDN and start building."
        ),
        tosiCode(
          { language: "html" },
          `<script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>`
        )
      )
    )
  ),

  // ===== 8. NESTED SCROLLING =====
  div(
    { style: { padding: "4em 1em", background: "#111", textAlign: "center" } },
    h2(
      {
        style: { fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "0 0 0.5em" },
      },
      "Nested Scroll Containers"
    ),
    p({
      style: { color: "#999", margin: "0 auto 2em", maxWidth: "500px" },
      innerHTML:
        "A <code>tosi-product</code> inside an <code>overflow-y: auto</code> div detects its scroll parent automatically.",
    }),
    div(
      {
        class: "nested-scroll",
        style: {
          height: "60vh",
          overflowY: "auto",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          maxWidth: "800px",
          margin: "0 auto",
          background: "#000",
        },
      },
      tosiProduct(
        ...(
          [
            [
              "tosi-product",
              "Top-level container. Wraps your scroll story.",
              "#0a0a1a",
              "#7ec8e3",
            ],
            [
              "tosi-product-section",
              "Converts scroll offset to 0\u21921 progress. Sticky viewport pinning.",
              "#1a0a1a",
              "#c792ea",
            ],
            [
              "tosi-interpolator",
              "Declarative CSS interpolation between waypoints.",
              "#0a1a0a",
              "#88e0a0",
            ],
            [
              "tosi-filmstrip",
              "Canvas-based frame animator from a single mosaic image.",
              "#1a1a0a",
              "#e0d888",
            ],
            [
              "tosi-scroll-mapper",
              "Generic scroll progress wrapper with a callback.",
              "#0a0a1a",
              "#e08888",
            ],
            [
              "tosi-scroll-camera",
              "Waypoint-driven camera controller for BabylonJS.",
              "#1a0a0a",
              "#c0a0e0",
            ],
          ] as [string, string, string, string][]
        ).map(([name, desc, bg, color], i, arr) =>
          tosiProductSection(
            { scroll: 200, style: { background: bg } },
            tosiInterpolator(
              { "data-scroll-animate": true },
              tosiWaypoint({
                progress: 0.0,
                style: {
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateY(0px)" : "translateY(40px)",
                },
              }),
              tosiWaypoint({
                progress: 0.3,
                style: { opacity: 1, transform: "translateY(0px)" },
              }),
              tosiWaypoint({
                progress: 0.7,
                style: { opacity: 1, transform: "translateY(0px)" },
              }),
              tosiWaypoint({
                progress: 1.0,
                style: {
                  opacity: i === arr.length - 1 ? 1 : 0,
                  transform: i === arr.length - 1 ? "translateY(0px)" : "translateY(-40px)",
                },
              }),
              div(
                { class: "feature-text", style: { flexDirection: "column" } },
                h2({ style: { color } }, `<${name}>`),
                p(desc)
              )
            )
          )
        )
      )
    )
  ),

  // ===== 9. HORIZONTAL SCROLLING =====
  div(
    {
      style: { padding: "4em 1em", background: "#0a0a0a", textAlign: "center" },
    },
    h2(
      {
        style: { fontSize: "clamp(1.5rem, 4vw, 2.5rem)", margin: "0 0 0.5em" },
      },
      "Horizontal Scrolling"
    ),
    p({
      style: { color: "#999", margin: "0 auto 2em", maxWidth: "500px" },
      innerHTML:
        'Set <code>direction="horizontal"</code> for side-scrolling sections.',
    }),
    div(
      {
        class: "nested-scroll",
        style: {
          width: "100%",
          maxWidth: "800px",
          height: "60vh",
          overflowX: "auto",
          overflowY: "hidden",
          border: "1px solid rgba(255,255,255,0.15)",
          borderRadius: "12px",
          margin: "0 auto",
          background: "#000",
          whiteSpace: "nowrap",
        },
      },
      tosiProduct(
        {
          style: {
            display: "inline-flex",
            width: "max-content",
            height: "100%",
          },
        },
        ...(
          [
            [
              "tosijs",
              "A front-end library for leveraging web components and CSS3 with proxy-based state management and O(1) virtual lists.",
              "#0a1a0a",
              "#88e0a0",
            ],
            [
              "tosijs-ui",
              "Web components that complement the DOM instead of fighting it.",
              "#1a1a0a",
              "#e0d888",
            ],
            [
              "tosijs-3d",
              "A declarative 3D library built on BabylonJS.",
              "#1a0a1a",
              "#c792ea",
            ],
            [
              "tjs-lang",
              "Fulfills the promise of JavaScript, Lisp, and Dylan. Transpiles TypeScript, turns types into runtime contracts, provides safe eval.",
              "#0a0a1a",
              "#7ec8e3",
            ],
          ] as [string, string, string, string][]
        ).map(([name, desc, bg, color], i, arr) =>
          tosiProductSection(
            {
              direction: "horizontal",
              scroll: i === arr.length - 1 ? 0 : 200,
              style: { background: bg, height: "100%", flexShrink: 0 },
            },
            tosiInterpolator(
              { "data-scroll-animate": true },
              tosiWaypoint({
                progress: 0.0,
                style: {
                  opacity: i === 0 ? 1 : 0,
                  transform: i === 0 ? "translateX(0px)" : "translateX(60px)",
                },
              }),
              tosiWaypoint({
                progress: 0.3,
                style: { opacity: 1, transform: "translateX(0px)" },
              }),
              tosiWaypoint({
                progress: 0.7,
                style: { opacity: 1, transform: "translateX(0px)" },
              }),
              tosiWaypoint({
                progress: 1.0,
                style: {
                  opacity: i === arr.length - 1 ? 1 : 0,
                  transform: i === arr.length - 1 ? "translateX(0px)" : "translateX(-60px)",
                },
              }),
              div(
                {
                  class: "feature-text",
                  style: { flexDirection: "column", whiteSpace: "normal" },
                },
                h2({ style: { color } }, name),
                p(desc)
              )
            )
          )
        )
      )
    )
  ),

  // ===== FOOTER =====
  div(
    {
      style: {
        textAlign: "center",
        padding: "4em 1em",
        background: "#000",
        color: "#555",
        fontSize: "0.9rem",
      },
    },
    p(
      "Built with ",
      elements.a(
        {
          href: "https://tosijs.net",
          style: { color: "#7ec8e3", textDecoration: "none" },
        },
        "tosijs"
      )
    )
  )
);

document.body.append(app);
