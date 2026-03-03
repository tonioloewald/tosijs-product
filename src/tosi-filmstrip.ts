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
