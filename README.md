# tosijs-product

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, Apple-style product stories with minimal code.

## Key Components

- **`tosiProduct`**: The main orchestrator that manages application state and coordinate space.
- **`tosiProductSection`**: A container that pins content to the viewport using `sticky` positioning and translates scroll position into a normalized `0..1` progress value.
- **`tosiScrollMapper`**: A general-purpose wrapper that maps scroll progress to custom elements via an `onProgress` callback.
- **`tosiFilmstrip`**: A high-performance frame-based animator that uses WebP mosaics (grids) instead of standard video for buttery-smooth scrolling.

## Frame-Based Animation (The Apple Way)

Standard video scrubbing often stutters. `tosijs-product` provides a CLI tool to convert videos into a single WebP mosaic grid, which the `tosiFilmstrip` component then scrubs through using a Canvas.

### 1. Create a Mosaic

Use the included CLI tool to convert your video:

```bash
bunx tosi-mosaic my-video.mp4 --frames 60 --width 1280
```

This will produce a file named `my-video_8x8_60.webp`. The filename contains the grid dimensions (`8x8`) and total frames (`60`), which the component uses for automatic configuration.

### 2. Use the Component

```typescript
import { tosiFilmstrip } from 'tosijs-product'

tosiFilmstrip({
  src: 'my-video_8x8_60.webp',
  'data-scroll-animate': 'true'
})
```

The component automatically parses the filename to configure its internal grid math.

### Why Matrix vs. Strip?

`tosi-mosaic` produces a **Matrix (Grid)** rather than a horizontal/vertical strip. Browsers have maximum image dimension limits (often 16,384px). A 100-frame strip of a 1080p video would be 192,000 pixels long and would fail to render. A 10x10 matrix keeps the dimensions well within GPU and browser limits.

## Features

- **Automated Progress Mapping**: Automatically scrubs through Lottie animations, Video timelines, and BabylonJS camera moves based on scroll position.
- **Keyframed Ranges**: Support for `data-scroll-range` allows timing different elements (like text overlays) to specific scroll segments.
- **Reactive Backgrounds**: Built-in `onProgress` callback for sections enables smooth transitions (e.g., background color fades) as users scroll.
- **Idiomatic tosijs**: Built entirely using the "Downhill" state model and `tosijs` element creators.

## Getting Started

### Installation

```bash
bun install tosijs-product
```

### Usage

#### As an ES Module (Modern)

```typescript
import { tosiProduct, tosiProductSection } from 'tosijs-product'
// ...
```

#### Via Script Tag (IIFE)

For quick prototypes or simple HTML pages, you can include the library directly:

```html
<script src="node_modules/tosijs-product/dist/index.js"></script>
<script>
  const { tosiProduct, tosiProductSection } = TosiProduct;
  // ...
</script>
```

Note: The IIFE version exports everything under the `TosiProduct` global namespace.

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
