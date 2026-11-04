# `<tosi-filmstrip>`

Canvas frame-animator. Rather than scrubbing a `<video>` (which stutters on random-access seeks),
`<tosi-filmstrip>` blits frames from a single **WebP/JPG mosaic grid** to a hardware-accelerated
canvas — instant, frame-perfect seeking driven by scroll.

<style>.doc-content:has(.doc-demo){--doc-content-padding:0;--doc-content-overflow:visible}.doc-content:has(.doc-demo)>:not(.doc-demo):not(style){max-width:44rem;margin-inline:auto;padding-inline:1.25rem;box-sizing:border-box}.doc-demo .media{aspect-ratio:16/9;max-height:var(--tosi-view-size,70vh);position:relative;overflow:hidden;background:#0a0a12}.doc-demo .media>tosi-filmstrip{position:absolute;inset:0;width:100%;height:100%}.doc-demo .cap{position:absolute;left:0;right:0;bottom:1rem;text-align:center;color:#fff;font-weight:700;filter:drop-shadow(0 1px 6px #000)}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="100">
<div class="media">
<tosi-filmstrip src="https://cdn.tosijs.net/tosijs-product/agent-owl_10x10_96.jpg" cols="10" rows="10" total="96" data-scroll-animate></tosi-filmstrip>
<div class="cap">100 frames from one image</div>
</div>
</tosi-product-section>
</tosi-product>

## Attributes

- **`src`** — the mosaic image. Filenames may encode the grid — `name_COLSxROWS_TOTAL.webp` is auto-parsed.
- **`cols`**, **`rows`**, **`total`** — grid columns, rows and frame count (optional when encoded in the filename).
- **`data-scroll-animate`** — marks it as a scroll-driven animator for its section.

## Making a mosaic

The `tosi-mosaic` CLI converts a video to a grid. It needs **`ffmpeg` and `ffprobe` on your PATH**
(macOS: `brew install ffmpeg`) — they are not bundled:

```bash
bunx tosi-mosaic my-video.mp4 --frames 100 --width 1280
```

Produces `my-video_10x10_100.webp`. A grid (not one long strip) keeps within the browser's max image size while delivering every frame in a single request.

`--format jpg` (or `png`) if your ffmpeg was built without the webp encoder — `<tosi-filmstrip>` reads all three. `--fps` supplies the source frame rate for a container that misreports it; when a file reports neither a frame count nor a duration, the CLI counts frames itself and says so. It exits non-zero on failure, so `tosi-mosaic … && deploy` is safe.

## Editable example

```html
<tosi-product>
  <tosi-product-section scroll="150">
    <tosi-filmstrip src="https://cdn.tosijs.net/tosijs-product/agent-owl_10x10_96.jpg" cols="10" rows="10" total="96" data-scroll-animate></tosi-filmstrip>
  </tosi-product-section>
</tosi-product>
```

See also [`<tosi-product>`](/tosi-product/) and [`<tosi-interpolator>`](/tosi-interpolator/).
