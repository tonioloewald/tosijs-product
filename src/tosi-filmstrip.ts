/*#
# `<tosi-filmstrip>`

Canvas frame-animator. Rather than scrubbing a `<video>` (which stutters on random-access seeks),
`<tosi-filmstrip>` blits frames from a single **WebP/JPG mosaic grid** to a hardware-accelerated
canvas — instant, frame-perfect seeking driven by scroll.

<style>.doc-content:has(.doc-demo){overflow:visible !important}.doc-demo .media{height:var(--tosi-view-size,70vh);position:relative;overflow:hidden;border-radius:12px;background:#0a0a12}.doc-demo .media>tosi-filmstrip{position:absolute;inset:0;width:100%;height:100%}.doc-demo .cap{position:absolute;left:0;right:0;bottom:1rem;text-align:center;color:#fff;font-weight:700;filter:drop-shadow(0 1px 6px #000)}</style>
<tosi-product class="doc-demo">
<tosi-product-section scroll="100">
<div class="media">
<tosi-filmstrip src="/agent-owl_10x10_100.jpg" cols="10" rows="10" total="100" data-scroll-animate></tosi-filmstrip>
<div class="cap">100 frames from one image</div>
</div>
</tosi-product-section>
</tosi-product>

## Attributes

- **`src`** — the mosaic image. Filenames may encode the grid — `name_COLSxROWS_TOTAL.webp` is auto-parsed.
- **`cols`**, **`rows`**, **`total`** — grid columns, rows and frame count (optional when encoded in the filename).
- **`data-scroll-animate`** — marks it as a scroll-driven animator for its section.

## Making a mosaic

The `tosi-mosaic` CLI (needs `ffmpeg`) converts a video to a grid:

```bash
bunx tosi-mosaic my-video.mp4 --frames 100 --width 1280
```

Produces `my-video_10x10_100.webp`. A grid (not one long strip) keeps within the browser's max image size while delivering every frame in a single request.

## Editable example

```html
<tosi-product>
  <tosi-product-section scroll="150">
    <tosi-filmstrip src="/agent-owl_10x10_100.jpg" cols="10" rows="10" total="100" data-scroll-animate></tosi-filmstrip>
  </tosi-product-section>
</tosi-product>
```

See also [`<tosi-product>`](/tosi-product/) and [`<tosi-interpolator>`](/tosi-interpolator/).
*/

import { Component, elements } from "tosijs";

const { canvas } = elements;

export class TosiFilmstrip extends Component {
  static initAttributes = {
    src: "",
    cols: 0,
    rows: 0,
    total: 0,
  };

  private _img: HTMLImageElement | null = null;
  private _ctx: CanvasRenderingContext2D | null = null;
  private _lastProgress: number = 0;
  private _canvas: HTMLCanvasElement | null = null;
  private _loadedSrc: string = "";
  private _loadId: number = 0;

  static styleSpec = {
    ":host": {
      display: "block",
      position: "relative",
      width: "100%",
      height: "100%",
    },
    canvas: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      display: "block",
    },
  };

  content = () => {
    this._canvas = canvas({ part: "canvas" }) as HTMLCanvasElement;
    return this._canvas;
  };

  private _parseGrid(): { cols: number; rows: number; total: number } | null {
    const src = this.getAttribute("src") || "";
    let cols = Number(this.getAttribute("cols")) || 0;
    let rows = Number(this.getAttribute("rows")) || 0;
    let total = Number(this.getAttribute("total")) || 0;

    if (!cols || !rows || !total) {
      const match = src.match(/(\d+)x(\d+)_(\d+)\.(webp|jpg|png|data)/i);
      if (match) {
        if (!cols) cols = parseInt(match[1]);
        if (!rows) rows = parseInt(match[2]);
        if (!total) total = parseInt(match[3]);
      }
    }

    if (!total || !cols || !rows) return null;
    return { cols, rows, total };
  }

  private load() {
    const src = this.getAttribute("src") || "";
    if (!src) return;

    const grid = this._parseGrid();
    if (!grid) return;

    const loadId = ++this._loadId;
    this._loadedSrc = src;
    const img = new Image();
    img.onload = () => {
      if (loadId !== this._loadId) return;
      this._img = img;
      this.setScrollProgress(this._lastProgress);
    };
    img.onerror = () => {
      if (loadId !== this._loadId) return;
      console.warn(`[tosi-filmstrip] Failed to load: ${src}`);
      this._img = null;
    };
    img.src = src;
  }

  setScrollProgress(progress: number) {
    this._lastProgress = progress;
    if (!this._img) return;

    const grid = this._parseGrid();
    if (!grid) return;
    const { cols, rows, total } = grid;

    const cvs =
      this._canvas || (this.parts && (this.parts.canvas as HTMLCanvasElement));
    if (!cvs) return;

    if (!this._ctx) this._ctx = cvs.getContext("2d");
    if (!this._ctx) return;

    const frameIndex = Math.max(
      0,
      Math.min(total - 1, Math.floor(progress * total))
    );
    const col = frameIndex % cols;
    const row = Math.floor(frameIndex / cols);

    const fw = this._img.width / cols;
    const fh = this._img.height / rows;

    if (cvs.width !== fw || cvs.height !== fh) {
      cvs.width = fw;
      cvs.height = fh;
    }

    this._ctx.clearRect(0, 0, fw, fh);
    this._ctx.drawImage(this._img, col * fw, row * fh, fw, fh, 0, 0, fw, fh);
  }

  connectedCallback() {
    super.connectedCallback();
    this.load();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._loadId++;
    this._img = null;
  }

  render() {
    super.render();
    const currentSrc = this.getAttribute("src") || "";
    if (!this._img || this._loadedSrc !== currentSrc) {
      this.load();
    } else {
      this.setScrollProgress(this._lastProgress);
    }
  }
}

export const tosiFilmstrip = TosiFilmstrip.elementCreator({
  tag: "tosi-filmstrip",
});
