# tosijs-product

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, "Apple-style" product stories with minimal code. It unifies Lottie, Video, BabylonJS 3D, Mapbox flights, and declarative CSS interpolation under a single, declarative scrolling model.

[**View the Live Demo**](https://tonioloewald.github.io/tosijs-product/)

## Key Components

- **`tosiProduct`**: The main container that wraps your product page.
- **`tosiProductSection`**: A container that pins content to the viewport using `sticky` positioning and translates scroll position into a normalized `0..1` progress value.
- **`tosiInterpolator` & `tosiWaypoint`**: A declarative system for interpolating CSS properties between keyframes as the user scrolls.
- **`tosiFilmstrip`**: A high-performance frame-based animator that uses WebP/PNG mosaics (grids) instead of standard video for buttery-smooth scrubbing.
- **`tosiScrollMapper`**: A general-purpose wrapper that maps scroll progress to custom elements via an `onProgress` callback (ideal for things like programmatic Mapbox flights).

## Getting Started

### 1. Pure HTML Page (Zero JS Orchestration)

The IIFE build is self-contained — a single script tag gives you `tosijs`, `tosijsUi`, and `tosijsProduct` as globals, with all custom elements registered automatically:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Product</title>
  <style>
    body { margin: 0; background: #000; color: #fff; overflow-x: hidden; }
  </style>
  <!-- One script tag — includes everything -->
  <script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
</head>
<body>
  <tosi-product>
    <tosi-product-section scroll="2000">
      <tosi-interpolator data-scroll-animate easing="ease-in-out">
        <tosi-waypoint progress="0.0" style="opacity: 0; transform: translateY(50px);"></tosi-waypoint>
        <tosi-waypoint progress="0.3" style="opacity: 1; transform: translateY(0px);"></tosi-waypoint>
        <tosi-waypoint progress="0.7" style="opacity: 1; transform: translateY(0px);"></tosi-waypoint>
        <tosi-waypoint progress="1.0" style="opacity: 0; transform: translateY(-50px);"></tosi-waypoint>
        <h1 style="position: absolute; width: 100vw; text-align: center;">
          Pure HTML. Zero JS.
        </h1>
      </tosi-interpolator>
    </tosi-product-section>
  </tosi-product>
</body>
</html>
```

### 2. Modern Web App (ESM)

For bundled apps (Vite, Webpack, etc.), install the package and its peer dependencies:

```bash
bun install tosijs tosijs-ui tosijs-product
```

```typescript
import { tosiProduct, tosiProductSection, tosiInterpolator, tosiWaypoint } from 'tosijs-product'

const app = tosiProduct(
  tosiProductSection({ scroll: 2000 },
    tosiInterpolator({ 'data-scroll-animate': '', easing: 'ease-in-out' },
      tosiWaypoint({ progress: 0, style: 'opacity: 0; transform: translateY(50px)' }),
      tosiWaypoint({ progress: 0.5, style: 'opacity: 1; transform: translateY(0px)' }),
      tosiWaypoint({ progress: 1, style: 'opacity: 0; transform: translateY(-50px)' }),
      document.createElement('h1')  // your content here
    )
  )
)

document.body.append(app)
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
