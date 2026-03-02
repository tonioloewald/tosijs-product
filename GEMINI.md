# tosijs-product

## Project Overview
`tosijs-product` is a cinematic product page component library built for `tosijs`. It provides high-performance, scroll-linked animation components to create immersive, "Apple-style" product stories using minimal code. It supports multiple media types including Lottie, Video (via WebP mosaics), and SVG Pan & Zoom, unifying them under a declarative scrolling model.

The project is written in TypeScript and utilizes `bun` as its primary runtime, package manager, and build tool.

### Architecture & Key Components
- **`src/`**: Contains the core library source code.
  - `tosi-product.ts`: The main orchestrator managing application state and coordinate space.
  - `tosi-filmstrip.ts`: A high-performance frame-based animator that uses WebP/PNG mosaics instead of standard video.
  - `tosi-interpolator.ts` & `waypoints.ts`: Systems for declarative CSS interpolation and animating layers of images or SVGs based on scroll progress.
- **`bin/tosi-mosaic.ts`**: A CLI tool to convert videos into a single WebP mosaic grid for frame-based animations.
- **`demo/`**: Contains the source code for the live demo.
- **`dev.ts`**: A custom build script and development server utilizing `Bun.build` and `Bun.serve`.

## Building and Running

This project uses `bun` for all development workflows. Ensure `bun` is installed on your system.

### Setup
Install dependencies:
```bash
bun install
```

### Development Server
Start the development server with watch mode (runs `dev.ts` on port 8788):
```bash
bun run start
```

### Build
Build the library (ESM and IIFE outputs) and the demo to the `dist/` and `demo/` directories respectively:
```bash
bun run build
```

### Formatting & Linting
Run ESLint and Prettier to format the codebase:
```bash
bun run format
```

### Testing
Run tests using Bun's built-in test runner:
```bash
bun run test
```

## Development Conventions

- **Package Manager**: Strictly use `bun` instead of `npm` or `yarn` for managing dependencies and running scripts.
- **Build Tooling**: The build process is defined in `dev.ts` using `Bun.build`. Do not modify standard bundler configs (like webpack or rollup) unless transitioning away from the custom Bun build script.
- **Styling and Formatting**: The project uses Prettier and ESLint. Always ensure code is formatted by running `bun run format` before committing.
- **Declarative Approach**: Features should prioritize declarative HTML configurations (zero-JS orchestration) when possible, falling back to a unified ESM-based approach.
- **Interactive Debugging**: Use `haltija` (`bunx haltija@latest -f`) for interactive debugging and development workflows.
