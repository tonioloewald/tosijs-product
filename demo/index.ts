import { tosiProduct, tosiProductSection, tosiScrollMapper, tosiFilmstrip, tosiPanZoom, tosiLayer, tosiWaypoint, interpolateWaypoints } from '../src/index'
import { markdownViewer, bodymovinPlayer, b3d, mapBox } from 'tosijs-ui'
import { elements } from 'tosijs'

// Global styles to ensure full-screen media and correct layering
const style = document.createElement('style')
style.textContent = `
  body { margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden; }
  tosi-product-section { display: block !important; width: 100% !important; position: relative !important; }
  tosi-lottie, tosi-3d, tosi-map, video, tosi-filmstrip, tosi-pan-zoom {
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

const overlay = (range: string, text: string, options: any = {}) => {
  return div({
    class: 'overlay',
    'data-scroll-range': range,
    ...options,
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
    markdownViewer('# Ray Tracing\n## Hardware-accelerated gaming.')
  ),

  tosiProductSection({ 
    scroll: 3000,
    style: { backgroundColor: '#fff', color: '#000' }
  },
    video({
      src: 'https://www.w3schools.com/html/mov_bbb.mp4',
      'data-scroll-animate': 'currentTime',
      muted: true,
      playsinline: true,
      autoplay: true,
      loop: true
    }),
    overlay('0.1, 0.5', 'Standard Video Scrubbing.')
  ),

  tosiProductSection({ scroll: 4000, style: { backgroundColor: '#fff' } },
    overlay('0, 0.5', 'A professional camera system.'),
    overlay('0.5, 1.0', 'In the palm of your hand.'),
    b3d({
      'data-scroll-animate': 'babylon',
      async sceneCreated(element: any, BABYLON: any) {
        const { scene } = element
        const camera = new BABYLON.ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 15, BABYLON.Vector3.Zero(), scene)
        scene.activeCamera = camera
        camera.minZ = 0.1
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
        
        const body = BABYLON.MeshBuilder.CreateBox('body', { width: 4, height: 8, depth: 0.5 }, scene)
        body.material = new BABYLON.StandardMaterial('bodyMat', scene)
        body.material.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05)

        const parts: any[] = []
        for (let i = 0; i < 3; i++) {
          const lens = BABYLON.MeshBuilder.CreateCylinder('lens' + i, { diameter: 1.2, height: 0.4 }, scene)
          lens.position.x = 1; lens.position.y = 3 - i * 1.5; lens.position.z = -0.6
          lens.parent = body; parts.push(lens)
        }

        const b3dWaypoints = [
          { progress: 0.0, rotY: -Math.PI / 2, radius: 15, partOffset: 3 },
          { progress: 0.5, rotY: 0, radius: 12.5, partOffset: 1.5 },
          { progress: 1.0, rotY: Math.PI / 2, radius: 10, partOffset: 0 }
        ]

        element.setScrollProgress = (progress: number) => {
          const current = interpolateWaypoints(progress, b3dWaypoints)
          if (!current) return
          body.rotation.y = current.rotY
          parts.forEach((part, i) => { 
            part.position.z = -0.6 - current.partOffset * (i + 1) 
          })
          camera.radius = current.radius
        }
      }
    })
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } },
    markdownViewer('# Explore the world.\n## From Half Moon Bay to Oulu in a single scroll.')
  ),

  tosiProductSection({ scroll: 5000, style: { backgroundColor: '#fff' } },
    tosiScrollMapper({
      onProgress(progress: number) {
        const map = (this as any).firstElementChild as any
        if (!map || !map.tagName.includes('MAP')) return
        const minZoom = 2
        const maxZoom = 12
        let moveP = 0
        if (progress > 0.1 && progress < 0.9) {
          moveP = ease((progress - 0.1) / 0.8)
        } else if (progress >= 0.9) {
          moveP = 1
        }
        const zp = Math.abs(progress - 0.5) * 2
        const zoom = minZoom + (zp * zp) * (maxZoom - minZoom)
        const lat = hmb.lat + (oulu.lat - hmb.lat) * moveP
        const lng = hmb.lng + (oulu.lng - hmb.lng) * moveP
        map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(4)}`
      }
    },
    mapBox({
      token: "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA",
      coords: `${hmb.lat},${hmb.lng},12`,
      mapStyle: "mapbox://styles/mapbox/dark-v11",
      style: { width: '100%', height: '100%', pointerEvents: 'none' }
    })),
    overlay('0.0, 0.2', 'Half Moon Bay'),
    overlay('0.8, 1.0', 'Oulu')
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } },
    markdownViewer('# Cinematic SVG Pan & Zoom.\n## Explore high-resolution vectors via waypoints.')
  ),

  tosiProductSection({ scroll: 4000, style: { backgroundColor: '#fff' } },
    tosiPanZoom({ 'data-scroll-animate': 'pan-zoom' },
      tosiLayer(
        // Layer 1: Background Vector
        elements.img({ src: 'https://tosijs.net/favicon.svg' }),
        tosiWaypoint({ progress: 0.0, x: 0.5, y: 0.5, zoom: 1.0, opacity: 0.2 }),
        tosiWaypoint({ progress: 0.5, x: 0.2, y: 0.2, zoom: 3.0, opacity: 1.0 }),
        tosiWaypoint({ progress: 1.0, x: 0.8, y: 0.8, zoom: 0.5, opacity: 0.2 })
      ),
      tosiLayer(
        // Layer 2: Floating logo
        elements.img({ src: 'https://tosijs.net/favicon.svg' }),
        tosiWaypoint({ progress: 0.0, x: 0.5, y: 0.5, zoom: 0.1, opacity: 1.0 }),
        tosiWaypoint({ progress: 0.5, x: 0.5, y: 0.5, zoom: 1.5, opacity: 0.8 }),
        tosiWaypoint({ progress: 1.0, x: 0.5, y: 0.5, zoom: 5.0, opacity: 0.0 })
      )
    ),
    overlay('0.1, 0.4', 'Dynamic multi-layer interpolation', { style: { color: '#000' } }),
    overlay('0.6, 0.9', 'Frame-perfect scaling', { style: { color: '#000' } })
  ),

  div({ style: { backgroundColor: '#fff', color: '#000' } },
    markdownViewer('# Pre-order today.\nStarting at $999.')
  )
)

document.body.append(app)
