# Component Reference

## tosi-product

Top-level container that wraps your scroll story. No required attributes.

```html
<tosi-product>
  <!-- sections go here -->
</tosi-product>
```

## tosi-product-section

Converts scroll position into a normalized 0-1 progress value. Content is pinned to the viewport via `position: sticky` while the user scrolls through extra height created by the `scroll` attribute.

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `scroll` | `100` | Scroll distance as a percentage of the container dimension. `100` = one viewport height (or width for horizontal). `300` = three viewports of scrolling. |
| `direction` | `vertical` | `"vertical"` or `"horizontal"` |
| `debug` | — | When present, shows an overlay with the current progress value |

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `scrollCallback` | `(progress: number, el: HTMLElement) => void` | Called on every scroll update with the current progress |

### How progress works

Progress is calculated as `clamp(-offset / scrollAmount, 0, 1)` where offset is the section's position relative to the scroll container. The section queries children with `[data-scroll-animate]` or `[data-scroll-range]` and dispatches progress to each.

Children receive progress via:
1. `setScrollProgress(localProgress)` if the element implements it
2. `data-scroll-animate="currentTime"` — sets `el.currentTime` on video elements
3. `data-scroll-animate="lottie"` — calls `animation.goToAndStop(frame, true)` on Lottie players

### Scroll ranges

Use `data-scroll-range="start,end"` on any child to constrain its animation to a sub-range. For example, `data-scroll-range="0.5,1"` means the child only animates during the second half of the section's scroll.

The CSS custom property `--local-progress` is set on every animated child and can be used in `calc()` expressions.

### Reduced motion

When `prefers-reduced-motion: reduce` is active, child animations are skipped. Only `scrollCallback` still fires.

## tosi-interpolator

Declarative CSS property interpolation between waypoints. Place `<tosi-waypoint>` children to define keyframes, and one or more content elements that receive the interpolated styles.

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `easing` | — | Set to `"ease-in-out"` for easeInOutQuad between waypoints. Default is linear. |

```html
<tosi-interpolator data-scroll-animate easing="ease-in-out">
  <tosi-waypoint progress="0.0" style="opacity: 0; transform: translateY(50px)"></tosi-waypoint>
  <tosi-waypoint progress="0.5" style="opacity: 1; transform: translateY(0px)"></tosi-waypoint>
  <tosi-waypoint progress="1.0" style="opacity: 0; transform: translateY(-50px)"></tosi-waypoint>
  <div>Your content here</div>
</tosi-interpolator>
```

### Interpolation details

- Numeric values within CSS strings are interpolated individually (e.g. `translateY(0px)` to `translateY(100px)`)
- Colors (`#hex`, `rgb()`, `hsl()`, named colors) use `color-mix(in srgb, ...)`
- Non-numeric, non-color values snap at the 50% mark

## tosi-waypoint

Defines a keyframe for `tosi-interpolator`. Hidden element — only its attributes matter.

### Attributes

| Attribute | Description |
|-----------|-------------|
| `progress` | 0-1 value defining where this keyframe sits in the scroll timeline |
| `style` | CSS styles at this keyframe |

When used inside `tosi-scroll-camera`, waypoints define camera properties instead of CSS styles (see below).

## tosi-filmstrip

Canvas-based frame animator using a single mosaic image (grid of frames). Provides stutter-free scrubbing without video decode overhead.

### Attributes

| Attribute | Description |
|-----------|-------------|
| `src` | URL of the mosaic image |
| `cols` | Number of columns in the grid |
| `rows` | Number of rows in the grid |
| `total` | Total number of frames |

If the filename matches the pattern `name_COLSxROWS_TOTAL.ext`, the grid dimensions are parsed automatically.

```html
<tosi-filmstrip
  src="clip_10x10_100.webp"
  data-scroll-animate
></tosi-filmstrip>
```

### Creating mosaics

Use the included CLI tool:

```bash
bunx tosi-mosaic video.mp4 -f 100 -w 640 -q 75
```

Options: `-f` frames, `-w` frame width, `-q` WebP quality, `-r` input FPS.

## tosi-scroll-mapper

Generic scroll progress wrapper. Receives progress from its parent section and forwards it to a callback. Useful for driving third-party components (maps, charts, etc.) that don't implement `setScrollProgress`.

### Properties

| Property | Type | Description |
|----------|------|-------------|
| `scrollCallback` | `(progress: number) => void` | Called with progress on every scroll update. `this` is the mapper element. |

```typescript
tosiScrollMapper(
  {
    scrollCallback(progress) {
      const map = this.querySelector("tosi-map");
      map.coords = `${lat},${lng},${zoom}`;
    },
  },
  mapBox({ token: "...", coords: "37.46,-122.43,12" })
)
```

## tosi-scroll-camera

Waypoint-driven camera controller for BabylonJS scenes. Place inside or as a sibling of a `<tosi-3d>` element. Uses `<tosi-waypoint>` children to define camera keyframes.

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `easing` | — | Set to `"ease-in-out"` for easeInOutQuad between waypoints |

### Waypoint attributes

For `ArcRotateCamera`:

| Attribute | Description |
|-----------|-------------|
| `alpha` | Horizontal rotation angle (radians) |
| `beta` | Vertical rotation angle (radians). 0 = top-down, pi/2 = eye-level |
| `radius` | Distance from target |
| `target-x`, `target-y`, `target-z` | Camera target position |

For positional cameras:

| Attribute | Description |
|-----------|-------------|
| `x`, `y`, `z` | Camera position |
| `fov` | Field of view |

```html
<tosi-scroll-camera data-scroll-animate easing="ease-in-out">
  <tosi-waypoint progress="0" alpha="-1.57" beta="1.2" radius="110"></tosi-waypoint>
  <tosi-waypoint progress="0.5" alpha="0" beta="1.0" radius="70"></tosi-waypoint>
  <tosi-waypoint progress="1" alpha="1.57" beta="1.55" radius="76"></tosi-waypoint>
</tosi-scroll-camera>
```

## tosi-scroll-time

Maps scroll progress to a time-of-day value on a sibling `<tosi-b3d-skybox>` element. Set `realtimeScale="0"` on the skybox to disable auto-advancement.

### Attributes

| Attribute | Default | Description |
|-----------|---------|-------------|
| `from` | `0` | Start hour (0-24) |
| `to` | `24` | End hour (0-24) |

```html
<tosi-scroll-time data-scroll-animate from="6" to="18"></tosi-scroll-time>
```

## tosi-scroll-animation

Scrubs a named BabylonJS AnimationGroup to the frame corresponding to scroll progress.

### Attributes

| Attribute | Description |
|-----------|-------------|
| `name` | Name of the AnimationGroup to control |

```html
<tosi-scroll-animation data-scroll-animate name="DoorOpen"></tosi-scroll-animation>
```
