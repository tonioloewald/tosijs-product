import { tosiProduct, tosiProductSection, tosiScrollMapper } from '../src/index'
import { markdownViewer, bodymovinPlayer, b3d, mapBox } from 'tosijs-ui'
import { elements } from 'tosijs'

// Global styles to ensure full-screen media and correct layering
const style = document.createElement('style')
style.textContent = `
  body { margin: 0; padding: 0; background: #000; color: #fff; overflow-x: hidden; }
  
  tosi-product-section {
    display: block !important;
    width: 100% !important;
    position: relative !important;
  }

  /* Target media elements specifically */
  tosi-lottie, tosi-3d, tosi-map, video {
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
    flex-direction: column;
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
  
  tosi-md {
    display: block;
    padding: 100px 20px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
  }

  .overlay-debug {
    display: none;
  }
`
document.head.appendChild(style)

const { div, h1, video } = elements

// Easing helper: easeInOutQuad
const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t

const overlay = (range: string, text: string) => {
  return div({
    class: 'overlay',
    'data-scroll-range': range,
    apply(el: any) {
      el.setScrollProgress = (progress: number) => {
        // Linear Pulse: 0 at 0, 1 at 0.5, 0 at 1
        const opacity = Math.max(0, 1 - Math.abs(progress - 0.5) * 2)
        
        el.style.opacity = opacity.toString()
        el.style.transform = `translateY(${(1 - opacity) * 20}px)`
      }
    }
  }, h1({ class: 'hero-text' }, text))
}

const london = { lat: 37.4636, lng: -122.4286 }
const paris = { lat: 65.0121, lng: 25.4651 }

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
    markdownViewer('# A19 Pro chip.\n## A monster for gaming.')
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
    overlay('0.1, 0.5', 'Hardware-accelerated ray tracing.')
  ),

  tosiProductSection({ scroll: 4000, style: { backgroundColor: '#fff' } },
    overlay('0, 0.5', 'A professional camera system.'),
    overlay('0.5, 1.0', 'In the palm of your hand.'),
    b3d({
      'data-scroll-animate': 'babylon',
      async sceneCreated(element: any, BABYLON: any) {
        const { scene } = element
        const camera = new BABYLON.ArcRotateCamera(
          'camera',
          -Math.PI / 2,
          Math.PI / 2.5,
          15,
          BABYLON.Vector3.Zero(),
          scene
        )
        scene.activeCamera = camera
        camera.minZ = 0.1
        new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)
        
        const body = BABYLON.MeshBuilder.CreateBox('body', { width: 4, height: 8, depth: 0.5 }, scene)
        body.material = new BABYLON.StandardMaterial('bodyMat', scene)
        body.material.diffuseColor = new BABYLON.Color3(0.05, 0.05, 0.05)

        const parts: any[] = []
        for (let i = 0; i < 3; i++) {
          const lens = BABYLON.MeshBuilder.CreateCylinder('lens' + i, { diameter: 1.2, height: 0.4 }, scene)
          lens.position.x = 1
          lens.position.y = 3 - i * 1.5
          lens.position.z = -0.6
          lens.parent = body
          parts.push(lens)
        }

        element.setScrollProgress = (progress: number) => {
          const e = ease(progress)
          body.rotation.y = (e - 0.5) * Math.PI
          parts.forEach((part, i) => {
            part.position.z = -0.6 - (1 - e) * (i + 1) * 3
          })
          camera.radius = 15 - e * 5
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
        const map = this.querySelector('tosi-map') as any
        if (!map) return
        
        const minZoom = 2
        const maxZoom = 12
        
        // Movement logic
        let moveP = 0
        if (progress > 0.1 && progress < 0.9) {
          moveP = ease((progress - 0.1) / 0.8)
        } else if (progress >= 0.9) {
          moveP = 1
        }

        // Zoom logic
        const zp = Math.abs(progress - 0.5) * 2
        const zoom = minZoom + (zp * zp) * (maxZoom - minZoom)
          
        const lat = london.lat + (paris.lat - london.lat) * moveP
        const lng = london.lng + (paris.lng - london.lng) * moveP
        map.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(1)}`
      }
    },
    mapBox({
      token: "pk.eyJ1IjoicG9kcGVyc29uIiwiYSI6ImNqc2JlbWU0bjA1ZmY0YW5ycHZod3VhbWcifQ.arvqfpOqMgFYkKgQ35UScA",
      coords: `${london.lat},${london.lng},12`,
      mapStyle: "mapbox://styles/mapbox/dark-v11",
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
