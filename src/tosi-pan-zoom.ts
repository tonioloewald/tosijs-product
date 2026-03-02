import { interpolateWaypoints } from './waypoints'

export class TosiWaypoint extends HTMLElement {}
if (!customElements.get('tosi-waypoint')) {
  customElements.define('tosi-waypoint', TosiWaypoint)
}

export const tosiWaypoint = (options: any) => {
  const el = document.createElement('tosi-waypoint') as any
  for (const k in options) {
    el.setAttribute(k, String(options[k]))
  }
  return el
}

export class TosiLayer extends HTMLElement {
  connectedCallback() {
    this.style.position = 'absolute'
    this.style.top = '0'
    this.style.left = '0'
    this.style.width = '100%'
    this.style.height = '100%'
    this.style.overflow = 'visible'
    this.style.pointerEvents = 'none'
    
    const content = this.firstElementChild as HTMLElement
    if (content && content.tagName !== 'TOSI-WAYPOINT') {
      content.style.position = 'absolute'
      content.style.top = '0'
      content.style.left = '0'
      content.style.width = '100%'
      content.style.height = '100%'
      if (content.tagName === 'IMG' || content.tagName === 'VIDEO' || content.tagName === 'SVG') {
        content.style.objectFit = 'cover'
      }
    }
  }

  setScrollProgress(progress: number) {
    const waypointsNodes = Array.from(this.querySelectorAll('tosi-waypoint'))
    if (waypointsNodes.length === 0) return

    const waypoints = waypointsNodes.map(w => ({
      progress: Number(w.getAttribute('progress') || 0),
      x: Number(w.getAttribute('x') || 0.5),
      y: Number(w.getAttribute('y') || 0.5),
      zoom: Number(w.getAttribute('zoom') || 1),
      opacity: Number(w.getAttribute('opacity') ?? 1)
    }))

    const current = interpolateWaypoints(progress, waypoints)
    if (!current) return

    const content = this.firstElementChild as HTMLElement
    if (content && content.tagName !== 'TOSI-WAYPOINT') {
      // If image is 100vw, x=0.5 -> 0vw translation. 
      // X=0 (left edge at center) -> (0.5 - 0) * 100 = 50vw translation
      // X=1 (right edge at center) -> (0.5 - 1) * 100 = -50vw translation
      content.style.transform = `translate(${(0.5 - current.x) * 100}vw, ${(0.5 - current.y) * 100}vh) scale(${current.zoom})`
      content.style.opacity = current.opacity.toString()
      content.style.transformOrigin = 'center'
    }
  }
}
if (!customElements.get('tosi-layer')) {
  customElements.define('tosi-layer', TosiLayer)
}

export const tosiLayer = (...args: any[]) => {
  const el = document.createElement('tosi-layer') as any
  for (const arg of args) {
    if (arg instanceof Node || typeof arg === 'string') {
      el.appendChild(typeof arg === 'string' ? document.createTextNode(arg) : arg)
    } else if (typeof arg === 'object') {
      Object.assign(el, arg)
    }
  }
  return el
}

export class TosiPanZoom extends HTMLElement {
  connectedCallback() {
    this.style.position = 'absolute'
    this.style.top = '0'
    this.style.left = '0'
    this.style.width = '100%'
    this.style.height = '100%'
    this.style.overflow = 'hidden'
  }

  setScrollProgress(progress: number) {
    const layers = this.querySelectorAll('tosi-layer')
    layers.forEach((layer: any) => {
      if (typeof layer.setScrollProgress === 'function') {
        layer.setScrollProgress(progress)
      }
    })
  }
}
if (!customElements.get('tosi-pan-zoom')) {
  customElements.define('tosi-pan-zoom', TosiPanZoom)
}

export const tosiPanZoom = (...args: any[]) => {
  const el = document.createElement('tosi-pan-zoom') as any
  for (const arg of args) {
    if (arg instanceof Node || typeof arg === 'string') {
      el.appendChild(typeof arg === 'string' ? document.createTextNode(arg) : arg)
    } else if (typeof arg === 'object') {
      Object.assign(el, arg)
    }
  }
  return el
}
