# tosijs-product

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, "Apple-style" product stories with minimal code. It unifies Lottie, Video, BabylonJS 3D, Mapbox flights, and multi-layer SVG Pan & Zoom under a single, declarative "Downhill" scrolling model.

[**View the Live Demo**](https://tonioloewald.github.io/tosijs-product/)

## Key Components

- **`tosiProduct`**: The main orchestrator that manages application state and coordinate space.
- **`tosiProductSection`**: A container that pins content to the viewport using `sticky` positioning and translates scroll position into a normalized `0..1` progress value. It provides an `onProgress` callback for creating dynamic background transitions.
- **`tosiScrollMapper`**: A general-purpose wrapper that maps scroll progress to custom elements via an `onProgress` callback (ideal for things like programmatic Mapbox flights).
- **`tosiFilmstrip`**: A high-performance frame-based animator that uses WebP/PNG mosaics (grids) instead of standard video for buttery-smooth scrubbing.
- **`tosiPanZoom` & `tosiWaypoint`**: A declarative system for animating layers of images or SVGs across the viewport as the user scrolls.

## Getting Started

### 1. Modern Web App (ESM)

If you are building a modern web application with a bundler (Vite, Webpack, etc.):

```bash
bun install tosijs-product
```

```typescript
import { tosiProduct, tosiProductSection } from 'tosijs-product'
import { markdownViewer, bodymovinPlayer } from 'tosijs-ui'

const app = tosiProduct(
  markdownViewer('# My Cinematic Product\nScroll to explore.'),
  
  tosiProductSection({ scroll: 2000 },
    bodymovinPlayer({
      src: '/my-animation.json',
      'data-scroll-animate': 'lottie'
    })
  )
)

document.body.append(app)
```

### 2. Pure HTML Page (Zero JS Orchestration)

For quick prototypes or CMS-driven websites, you can drop the library into your HTML via CDN and build the entire experience using just declarative HTML tags:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Product</title>
  <style>
    body { margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden; }
    tosi-product-section { display: block; width: 100%; position: relative; }
    tosi-lottie, video, img.bg {
      position: absolute !important;
      top: 0; left: 0;
      width: 100vw !important;
      height: 100vh !important;
      object-fit: cover !important;
    }
  </style>
  
  <!-- Load tosijs-ui and tosijs-product -->
  <script src="https://cdn.jsdelivr.net/npm/tosijs-ui/dist/index.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
</head>
<body>
  <!-- The entire experience is defined purely in HTML. No JS required! -->
  <tosi-product>
    <tosi-product-section scroll="2000">
      <tosi-lottie src="https://tosijs.net/tosi.json" data-scroll-animate="lottie"></tosi-lottie>
      
      <!-- Declarative Text Interpolation -->
      <tosi-interpolator data-scroll-animate="interpolator">
        <tosi-waypoint progress="0.0" style="opacity: 0; transform: translateY(50px)"></tosi-waypoint>
        <tosi-waypoint progress="0.3" style="opacity: 1; transform: translateY(0px)"></tosi-waypoint>
        <tosi-waypoint progress="0.7" style="opacity: 1; transform: translateY(0px)"></tosi-waypoint>
        <tosi-waypoint progress="1.0" style="opacity: 0; transform: translateY(-50px)"></tosi-waypoint>
        <h1 style="position: absolute; width: 100vw; text-align: center;">Pure HTML. Zero JS.</h1>
      </tosi-interpolator>
    </tosi-product-section>
  </tosi-product>

  <script>
    // Just ensure the components from tosijs-ui are registered
    TosiUi.bodymovinPlayer();
  </script>
</body>
</html>
```

## Features

### Frame-Based Animation (The Apple Way)

Standard video scrubbing (`video.currentTime`) often stutters because decoders aren't designed for random-access seeking. `tosijs-product` provides a CLI tool to convert videos into a single WebP mosaic grid, which the `tosiFilmstrip` component then scrubs through using a hardware-accelerated Canvas.

**1. Create a Mosaic:**
Use the included CLI tool to convert your video:
```bash
bunx tosi-mosaic my-video.mp4 --frames 100 --width 1280
```
This produces `my-video_10x10_100.webp`. The filename contains the grid dimensions (`10x10`) and total frames (`100`), which the component uses for automatic configuration.

**2. Use the Component:**
```html
<tosi-filmstrip src="my-video_10x10_100.webp" data-scroll-animate="true"></tosi-filmstrip>
```

*Note: A Matrix (Grid) is used rather than a single long strip because browsers have maximum image dimension limits (often 16,384px). A 10x10 matrix keeps the dimensions well within GPU limits while delivering 100 frames in a single network request.*

### Declarative CSS Interpolation

You can choreograph complex, multi-layered animations (like SVG pan & zoom or text reveals) using the `<tosi-interpolator>` and `<tosi-waypoint>` system. Set starting, middle, and ending CSS styles, and the orchestrator handles the easing.

```html
<tosi-product-section scroll="4000">
  <tosi-interpolator data-scroll-animate="interpolator">
    <!-- Waypoints define the timeline -->
    <tosi-waypoint progress="0.0" style="transform: scale(1.0); opacity: 0.2;"></tosi-waypoint>
    <tosi-waypoint progress="0.5" style="transform: scale(3.0); opacity: 1.0;"></tosi-waypoint>
    <tosi-waypoint progress="1.0" style="transform: scale(0.5); opacity: 0.2;"></tosi-waypoint>
    
    <!-- The target element receives the interpolated styles -->
    <img src="background.svg" class="bg">
  </tosi-interpolator>
</tosi-product-section>
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
