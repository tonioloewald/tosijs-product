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

```typescript
import { tosiProduct, tosiProductSection } from 'tosijs-product'
import { xinMd, bodymovinPlayer } from 'tosijs-ui'

const app = tosiProduct(
  xinMd('# My Product'),
  tosiProductSection({ scroll: 2000 },
    bodymovinPlayer({
      src: '/my-animation.json',
      'data-scroll-animate': 'lottie'
    })
  )
)

document.body.append(app)
```

## License

Licensed under the Apache License, Version 2.0. See [LICENSE](LICENSE) for details.
