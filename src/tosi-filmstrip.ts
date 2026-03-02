import { BodymovinPlayer, B3d, MapBox } from 'tosijs-ui'
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
  private _lastProgress: number = 0
  private _canvas: HTMLCanvasElement | null = null

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
      objectFit: 'contain',
      display: 'block'
    }
  }

  content = ({canvas}: any) => {
    this._canvas = canvas({ part: 'canvas' }) as HTMLCanvasElement
    return this._canvas
  }

  private async load() {
    const src = this.getAttribute('src') || (this as any).src
    if (!src) return
    
    let cols = Number(this.getAttribute('cols')) || (this as any).cols
    let rows = Number(this.getAttribute('rows')) || (this as any).rows
    let total = Number(this.getAttribute('total')) || (this as any).total

    if (!cols || !rows || !total) {
      const match = src.match(/(\d+)x(\d+)_(\d+)\.(webp|jpg|png|data)/i)
      if (match) {
        if (!cols) cols = parseInt(match[1])
        if (!rows) rows = parseInt(match[2])
        if (!total) total = parseInt(match[3])
      }
    }

    if (!total || !cols || !rows) return

    const img = new Image()
    img.onload = () => {
      this._img = img
      this.setScrollProgress(this._lastProgress)
    }
    img.src = src
  }

  setScrollProgress(progress: number) {
    this._lastProgress = progress
    if (!this._img) return
    
    const total = Number(this.getAttribute('total')) || (this as any).total
    const cols = Number(this.getAttribute('cols')) || (this as any).cols
    const rows = Number(this.getAttribute('rows')) || (this as any).rows
    
    if (!total || !cols || !rows) return
    
    const canvas = this._canvas || (this.parts && this.parts.canvas as HTMLCanvasElement)
    if (!canvas) return
    
    if (!this._ctx) this._ctx = canvas.getContext('2d')
    if (!this._ctx) return

    const frameIndex = Math.max(0, Math.min(total - 1, Math.floor(progress * total)))
    const col = frameIndex % cols
    const row = Math.floor(frameIndex / cols)
    
    const fw = this._img.width / cols
    const fh = this._img.height / rows

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
    const currentSrc = this.getAttribute('src') || (this as any).src
    if (!this._img || this._img.src !== currentSrc) {
      this.load()
    } else {
      this.setScrollProgress(this._lastProgress)
    }
  }
}

export const tosiFilmstrip = TosiFilmstrip.elementCreator({ tag: 'tosi-filmstrip' })
