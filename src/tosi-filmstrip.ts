import { Component, elements } from 'tosijs'

const { canvas } = elements

export class TosiFilmstrip extends Component {
  static initAttributes = {
    src: '',
    cols: 0,
    rows: 0,
    total: 0
  }

  private _img: HTMLImageElement | null = null
  private _ctx: CanvasRenderingContext2D | null = null
  private _loading: Promise<void> | null = null

  static styleSpec = {
    ':host': {
      display: 'block',
      position: 'relative',
      width: '100%',
      height: '100%'
    },
    'canvas': {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    }
  }

  content = canvas({ part: 'canvas' })

  private async load() {
    if (!this.src) return
    
    // Auto-parse config from filename if not provided
    // format: name_WxH_total.webp
    if (!this.cols || !this.rows || !this.total) {
      const match = this.src.match(/(\d+)x(\d+)_(\d+)\.(webp|jpg|png)$/i)
      if (match) {
        if (!this.cols) this.cols = parseInt(match[1])
        if (!this.rows) this.rows = parseInt(match[2])
        if (!this.total) this.total = parseInt(match[3])
      }
    }

    this._loading = new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        this._img = img
        this.render()
        resolve()
      }
      img.onerror = reject
      img.src = this.src
    })
    return this._loading
  }

  setScrollProgress(progress: number) {
    if (!this._img || !this.total) return
    
    const { canvas } = this.parts as { canvas: HTMLCanvasElement }
    if (!this._ctx) this._ctx = canvas.getContext('2d')
    if (!this._ctx) return

    const frameIndex = Math.max(0, Math.min(this.total - 1, Math.floor(progress * this.total)))
    const col = frameIndex % this.cols
    const row = Math.floor(frameIndex / this.cols)
    
    const fw = this._img.width / this.cols
    const fh = this._img.height / this.rows

    // Update canvas resolution if needed
    if (canvas.width !== fw || canvas.height !== fh) {
      canvas.width = fw
      canvas.height = fh
    }

    this._ctx.clearRect(0, 0, fw, fh)
    this._ctx.drawImage(
      this._img,
      col * fw, row * fh, fw, fh,
      0, 0, fw, fh
    )
  }

  connectedCallback() {
    super.connectedCallback()
    this.load()
  }

  render() {
    super.render()
    if (this._img && (this as any)._progress !== undefined) {
      this.setScrollProgress((this as any)._progress)
    }
  }
}

export const tosiFilmstrip = TosiFilmstrip.elementCreator({ tag: 'tosi-filmstrip' })
