# tosijs-product

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, "Apple-style" product stories with minimal code. It unifies Lottie, video, BabylonJS 3D, Mapbox flights, themes, and declarative CSS interpolation under a single scroll engine.

[**View the Live Demo**](https://tonioloewald.github.io/tosijs-product/)

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

```html
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
    <script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
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

```bash
bun install tosijs tosijs-ui tosijs-product
```

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

```ts
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

Standard video scrubbing (`video.currentTime`) often stutters because decoders aren't designed for random-access seeking. The `tosi-mosaic` CLI converts a video to a single WebP mosaic grid, and `<tosi-filmstrip>` scrubs through it using a hardware-accelerated canvas.

```bash
bunx tosi-mosaic my-video.mp4 --frames 100 --width 1280
```

Produces `my-video_10x10_100.webp` (the filename encodes grid + total frames):

```html
<tosi-filmstrip
  src="my-video_10x10_100.webp"
  data-scroll-animate
></tosi-filmstrip>
```

A grid (rather than a single long strip) keeps dimensions inside the browser's max image size (commonly 16,384px) while delivering all frames in one request.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
