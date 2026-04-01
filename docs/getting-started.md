# Getting Started

## Installation

### Pure HTML (IIFE build)

A single script tag gives you everything — tosijs, tosijs-ui, and tosijs-product with all custom elements registered:

```html
<script src="https://cdn.jsdelivr.net/npm/tosijs-product/dist/index.js"></script>
```

### ESM (bundled apps)

```bash
bun install tosijs tosijs-ui tosijs-product
```

```typescript
import {
  tosiProduct,
  tosiProductSection,
  tosiInterpolator,
  tosiWaypoint,
  tosiFilmstrip,
  tosiScrollMapper,
  tosiScrollCamera,
} from "tosijs-product";
```

## Quick Start

Every tosijs-product page follows the same pattern:

1. Wrap everything in `<tosi-product>`
2. Create `<tosi-product-section>` elements — each one pins its content and converts scroll distance to 0-1 progress
3. Inside sections, use `data-scroll-animate` on children to drive them with scroll progress

### Minimal example

```html
<tosi-product>
  <tosi-product-section scroll="200">
    <tosi-interpolator data-scroll-animate easing="ease-in-out">
      <tosi-waypoint progress="0.0" style="opacity: 0; transform: scale(0.9)"></tosi-waypoint>
      <tosi-waypoint progress="0.3" style="opacity: 1; transform: scale(1)"></tosi-waypoint>
      <tosi-waypoint progress="0.7" style="opacity: 1; transform: scale(1)"></tosi-waypoint>
      <tosi-waypoint progress="1.0" style="opacity: 0; transform: scale(0.9)"></tosi-waypoint>
      <h1>Hello, World</h1>
    </tosi-interpolator>
  </tosi-product-section>
</tosi-product>
```

The `scroll="200"` means the section creates 2x the viewport height of scroll distance. As the user scrolls through it, progress goes from 0 to 1, and the interpolator fades the heading in and out.

## The scroll attribute

The `scroll` attribute is a **viewport-relative percentage**, not pixels:

- `scroll="100"` — 1x the container dimension (default)
- `scroll="300"` — 3x, giving more scroll distance for slower animations
- `scroll="500"` — 5x, for long sequences like map flights

## Scroll ranges

Use `data-scroll-range` to constrain a child's animation to part of the section:

```html
<tosi-product-section scroll="300">
  <!-- First half -->
  <tosi-interpolator data-scroll-range="0,0.5" easing="ease-in-out">
    <tosi-waypoint progress="0" style="opacity: 0"></tosi-waypoint>
    <tosi-waypoint progress="0.5" style="opacity: 1"></tosi-waypoint>
    <tosi-waypoint progress="1" style="opacity: 0"></tosi-waypoint>
    <h2>Part One</h2>
  </tosi-interpolator>

  <!-- Second half -->
  <tosi-interpolator data-scroll-range="0.5,1" easing="ease-in-out">
    <tosi-waypoint progress="0" style="opacity: 0"></tosi-waypoint>
    <tosi-waypoint progress="0.5" style="opacity: 1"></tosi-waypoint>
    <tosi-waypoint progress="1" style="opacity: 0"></tosi-waypoint>
    <h2>Part Two</h2>
  </tosi-interpolator>
</tosi-product-section>
```

## Video scrubbing

Add `data-scroll-animate="currentTime"` to any `<video>` element:

```html
<tosi-product-section scroll="300">
  <video src="clip.mp4" data-scroll-animate="currentTime" muted playsinline preload="auto"></video>
</tosi-product-section>
```

For smoother results, convert the video to a filmstrip mosaic (see [Components](components.md#tosi-filmstrip)).

## Lottie animations

```html
<tosi-product-section scroll="200">
  <tosi-lottie src="animation.json" data-scroll-animate="lottie"></tosi-lottie>
</tosi-product-section>
```

## Nested and horizontal scrolling

Sections auto-detect their scroll parent. Place a `<tosi-product>` inside any scrollable container and it works:

```html
<div style="height: 60vh; overflow-y: auto;">
  <tosi-product>
    <tosi-product-section scroll="200">...</tosi-product-section>
  </tosi-product>
</div>
```

For horizontal scrolling, set `direction="horizontal"` and use the appropriate layout on the parent:

```html
<div style="overflow-x: auto; white-space: nowrap;">
  <tosi-product style="display: inline-flex; width: max-content; height: 100%">
    <tosi-product-section direction="horizontal" scroll="200" style="flex-shrink: 0">
      ...
    </tosi-product-section>
  </tosi-product>
</div>
```

## Accessibility

When `prefers-reduced-motion: reduce` is active, all scroll-driven child animations are skipped. Only `scrollCallback` continues to fire, allowing you to provide alternative experiences.
