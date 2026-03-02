import { BodymovinPlayer, B3d, MapBox, tosijs } from 'tosijs-ui'

const { elements } = tosijs
const { div, span } = elements

export const tosiProductSection = (options: any, ...children: any[]) => {
  const scrollAmount = options.scroll || 1000
  const onProgress = options.onProgress
  const debug = options.debug || false
  
  const debugInfo = debug ? span({
    class: 'tosi-debug',
    style: {
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0,0,0,0.8)',
      color: '#0f0',
      padding: '5px 10px',
      fontFamily: 'monospace',
      fontSize: '12px',
      zIndex: 100,
      borderRadius: '4px',
      pointerEvents: 'none'
    }
  }) : []

  const stickyContainer = div({
    class: 'tosi-sticky',
    style: {
      position: 'sticky',
      top: 0,
      left: 0,
      height: '100vh',
      width: '100vw',
      overflow: 'hidden',
      zIndex: 1,
      backgroundColor: 'inherit'
    }
  }, ...children, debugInfo)

  const section = div({
    class: 'tosi-section',
    style: {
      display: 'block',
      position: 'relative',
      width: '100%',
      height: `calc(100vh + ${scrollAmount}px)`,
      backgroundColor: '#000',
      color: '#fff'
    }
  }, stickyContainer)

  const { scroll, onProgress: _, debug: __, ...otherOptions } = options
  if (otherOptions.style) {
    Object.assign(section.style, otherOptions.style)
    delete otherOptions.style
  }
  Object.assign(section, otherOptions)

  const updateProgress = () => {
    if (!section.isConnected) return

    const rect = section.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, -rect.top / scrollAmount))
    
    section.dataset.progress = progress.toFixed(3)
    if (debug && !Array.isArray(debugInfo)) {
      (debugInfo as HTMLElement).textContent = `Section: ${progress.toFixed(3)}`
    }
    
    if (typeof onProgress === 'function') {
      onProgress(progress, section)
    }
    
    const animators = section.querySelectorAll('[data-scroll-animate], [data-scroll-range]')
    animators.forEach((el: any) => {
      const rangeStr = el.getAttribute('data-scroll-range') || '0,1'
      const [start, end] = rangeStr.split(',').map(Number)
      const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)))
      
      el.style.setProperty('--local-progress', localProgress.toString())
      el.dataset.localProgress = localProgress.toFixed(3)

      if (typeof el.setScrollProgress === 'function') {
        el.setScrollProgress(localProgress)
      } else if (el.animation && (el instanceof BodymovinPlayer || el.tagName.includes('LOTTIE'))) {
        el.animation.goToAndStop(localProgress * el.animation.totalFrames, true)
      } else if (el.scene && (el instanceof B3d || el.tagName.includes('3D'))) {
        if (el.scene.activeCamera && el.scene.activeCamera.alpha !== undefined) {
          el.scene.activeCamera.alpha = localProgress * Math.PI * 2
        }
      } else if (el instanceof MapBox || el.tagName.includes('MAP')) {
        const london = { lat: 37.4636, lng: -122.4286 }
        const paris = { lat: 65.0121, lng: 25.4651 }
        const zp = Math.abs(localProgress - 0.5) * 2
        const zoom = 2 + (zp * zp) * 10
        const lat = london.lat + (paris.lat - london.lat) * localProgress
        const lng = london.lng + (paris.lng - london.lng) * localProgress
        el.coords = `${lat.toFixed(6)},${lng.toFixed(6)},${zoom.toFixed(1)}`
      }
    })
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress)
  }, { passive: true })

  // Force updateProgress into global window for debugging
  ;(window as any).UPDATE_PROGRESS = updateProgress;

  setTimeout(updateProgress, 100)

  return section
}

export const tosiProduct = (...children: any[]) => {
  return div({
    style: {
      display: 'block',
      position: 'relative',
      width: '100%',
      background: '#000',
      color: '#fff'
    }
  }, ...children)
}

export const tosiScrollMapper = (options: any, ...children: any[]) => {
  const el = div({ 
    'data-scroll-animate': 'mapper',
    style: { display: 'block', width: '100%', height: '100%' } 
  }, ...children) as any
  
  if (options.onProgress) {
    el.setScrollProgress = options.onProgress.bind(el)
  }
  
  return el
}
