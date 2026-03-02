import { tosiProduct, tosiProductSection, tosiScrollMapper, tosiFilmstrip } from '../src/index'
import { markdownViewer, bodymovinPlayer, b3d, mapBox } from 'tosijs-ui'
import { elements } from 'tosijs'

// Global styles to ensure full-screen media and correct layering
const style = document.createElement('style')
style.textContent = `
  body { margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden; }
  tosi-product-section { display: block !important; width: 100% !important; position: relative !important; }
  tosi-lottie, tosi-3d, tosi-map, video, tosi-filmstrip {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    object-fit: cover !important;
    display: block !important;
  }
  .overlay {
    position: absolute !important;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    z-index: 10;
  }
  .hero-text {
    font-size: 5rem;
    font-weight: 800;
    text-align: center;
    background: linear-gradient(to bottom, #fff, #999);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    padding: 0 20px;
    margin: 0;
  }
  tosi-md { display: block; padding: 100px 20px; max-width: 800px; margin: 0 auto; text-align: center; }
`
document.head.appendChild(style)

const { div, h1, video } = elements
const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const overlay = (range: string, text: string) => {
  return div({
    class: 'overlay',
    'data-scroll-range': range,
    apply(el: any) {
      el.setScrollProgress = (progress: number) => {
        const opacity = Math.max(0, 1 - Math.abs(progress - 0.5) * 2)
        el.style.opacity = opacity.toString()
        el.style.transform = `translateY(${(1 - opacity) * 20}px)`
      }
    }
  }, h1({ class: 'hero-text' }, text))
}

// Programmatically generate a mosaic for the demo
const generateMosaic = () => {
  const c = document.createElement('canvas')
  const fw = 320, fh = 180
  const cols = 10, rows = 10
  c.width = fw * cols
  c.height = fh * rows
  const ctx = c.getContext('2d')!
  for (let i = 0; i < 100; i++) {
    const col = i % cols
    const row = Math.floor(i / cols)
    const x = col * fw
    const y = row * fh
    ctx.fillStyle = `hsl(${(i * 3.6)}, 70%, 20%)`
    ctx.fillRect(x, y, fw, fh)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 80px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText((i + 1).toString(), x + fw / 2, y + fh / 2)
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.fillRect(x, y + fh - 10, fw * (i / 99), 10)
  }
  return c.toDataURL('image/png')
}

const mosaicData = generateMosaic()
const hmb = { lat: 37.4636, lng: -122.4286 }
const oulu = { lat: 65.0121, lng: 25.4651 }

const app = tosiProduct(
  markdownViewer('# iPhone 17 Pro\n## Titanium. So strong. So light. So Pro.\nScroll down to explore.'),

  tosiProductSection({ 
    scroll: 2000,
    onProgress(progress: number, el: HTMLElement) {
      const color = Math.round(progress * 255)
      el.style.backgroundColor = `rgb(${color}, ${color}, ${color})`
      const textColor = progress > 0.5 ? 0 : 255
      el.style.color = `rgb(${textColor}, ${textColor}, ${textColor})`
    }
  },
    bodymovinPlayer({
      src: 'https://tosijs.net/tosi.json',
      'data-scroll-animate': 'lottie',
      style: { opacity: '0.7' }
    }),
    overlay('0, 0.4', 'The first 100% recycled titanium.'),
    overlay('0.6, 1.0', 'Lighter than ever before.')
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } }, 
    markdownViewer('# Frame-Perfect Performance\n## The mosaic "Filmstrip" provides buttery-smooth scrubbing.')
  ),

  tosiProductSection({ scroll: 3000, style: { backgroundColor: '#000' } },
    tosiFilmstrip({
      src: mosaicData,
      cols: 10,
      rows: 10,
      total: 100,
      'data-scroll-animate': 'true'
    }),
    overlay('0.1, 0.9', '100% Smooth. 0% Stutter.')
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } }, 
    markdownViewer('# Explore the world.\n## From Half Moon Bay to Oulu in a single scroll.')
  ),

  tosiProductSection({ scroll: 5000, style: { backgroundColor: '#fff' } },
    tosiScrollMapper({
      onProgress(progress: number) {
        // Direct property update on the child element
        const map = (this as any).firstElementChild as any
        if (!map || !map.tagName.includes('MAP')) return
        
        const minZoom = 2
        const maxZoom = 12
        const moveP = progress > 0.1 && progress < 0.9 ? ease((progress - 0.1) / 0.8) : (progress >= 0.9 ? 1 : 0)
        const zp = Math.abs(progress - 0.5) * 2
        const zoom = minZoom + (zp * zp) * (maxZoom - minZoom)
          
        const lat = hmb.lat + (oulu.lat - hmb.lat) * moveP
        const lng = hmb.lng + (oulu.lng - hmb.lng) * moveP
        map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(1)}`
      }
    },
    mapBox({
      token: "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA",
      coords: `${hmb.lat},${hmb.lng},12`,
      mapStyle: "mapbox://styles/mapbox/light-v11",
      style: { width: '100%', height: '100%', pointerEvents: 'none' }
    })),
    overlay('0.0, 0.2', 'Half Moon Bay'),
    overlay('0.8, 1.0', 'Oulu')
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } },
    markdownViewer('# Pre-order today.\nStarting at $999.')
  )
)

document.body.append(app)
