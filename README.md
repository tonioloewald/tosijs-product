# tosijs-product

A cinematic product page component library for `tosijs`.

`tosijs-product` provides high-performance, scroll-linked animation components designed to create immersive, Apple-style product stories with minimal code.

## Key Components

- **`tosiProduct`**: The main orchestrator that manages application state and coordinate space.
- **`tosiProductSection`**: A container that pins content to the viewport using `sticky` positioning and translates scroll position into a normalized `0..1` progress value.
- **`tosiScrollMapper`**: A general-purpose wrapper that maps scroll progress to custom elements via an `onProgress` callback.

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
