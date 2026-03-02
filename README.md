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

### 2. Simple HTML Page (IIFE / CDN)

For quick prototypes or traditional websites, you can drop the library right into your HTML via jsDelivr:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>My Product</title>
  <!-- Global styles required for full-screen media -->
  <style>
    body { margin: 0; padding: 0; background: #000; color: #fff; }
    tosi-product-section { display: block; width: 100%; position: relative; }
    tosi-lottie, video {
      position: absolute !important;
      top: 0; left: 0;
      width: 100vw !important;
      height: 100vh !important;
      object-fit: cover !important;
      display: block !important;
    }
  </style>
  
  <!-- Load tosijs-ui and tosijs-product -->
  <script src="https://cdn.jsdelivr.net/npm/tosijs-ui/dist/index.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
</head>
<body>
  <script>
    // Extract what we need from the global namespaces
    const { tosiProduct, tosiProductSection } = TosiProduct;
    const { markdownViewer, bodymovinPlayer } = TosiUi;

    const app = tosiProduct(
      markdownViewer('# My Product\nScroll to explore.'),
      
      tosiProductSection({ scroll: 2000 },
        bodymovinPlayer({
          src: 'https://tosijs.net/tosi.json',
          'data-scroll-animate': 'lottie'
        })
      )
    )

    document.body.append(app)
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
```typescript
import { tosiFilmstrip } from 'tosijs-product'

tosiFilmstrip({
  src: 'my-video_10x10_100.webp',
  'data-scroll-animate': 'true'
})
```

*Note: A Matrix (Grid) is used rather than a single long strip because browsers have maximum image dimension limits (often 16,384px). A 10x10 matrix keeps the dimensions well within GPU limits while delivering 100 frames in a single network request.*

### Declarative SVG Pan & Zoom

You can choreograph multi-layered vector animations using the Waypoints system. Set starting, middle, and ending coordinates, and the orchestrator handles the easing.

```typescript
tosiProductSection({ scroll: 4000 },
  tosiPanZoom({ 'data-scroll-animate': 'pan-zoom' },
    // Layer 1
    tosiLayer(
      elements.img({ src: 'background.svg' }),
      tosiWaypoint({ progress: 0.0, x: 0.5, y: 0.5, zoom: 1.0 }),
      tosiWaypoint({ progress: 1.0, x: 0.8, y: 0.8, zoom: 0.5 })
    ),
    // Layer 2
    tosiLayer(
      elements.img({ src: 'foreground.svg' }),
      tosiWaypoint({ progress: 0.0, x: 0.5, y: 0.5, zoom: 0.1 }),
      tosiWaypoint({ progress: 1.0, x: 0.5, y: 0.5, zoom: 5.0 })
    )
  )
)
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
