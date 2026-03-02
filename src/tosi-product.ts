import { BodymovinPlayer, B3d, MapBox, tosijs } from 'tosijs-ui'

const { elements } = tosijs
const { div, slot } = elements

export const tosiProductSection = (options: any, ...children: any[]) => {
  const scrollAmount = options.scroll || 1000
  const onProgress = options.onProgress
  
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
  }, ...children)

  const section = div({
    style: {
      display: 'block',
      position: 'relative',
      width: '100%',
      height: `calc(100vh + ${scrollAmount}px)`,
      backgroundColor: '#000',
      color: '#fff'
    }
  }, stickyContainer)

  const { scroll, onProgress: _, ...otherOptions } = options
  if (otherOptions.style) {
    Object.assign(section.style, otherOptions.style)
    delete otherOptions.style
  }
  Object.assign(section, otherOptions)

  const updateProgress = () => {
    const rect = section.getBoundingClientRect()
    const progress = Math.max(0, Math.min(1, -rect.top / scrollAmount))
    
    section.dataset.progress = progress.toFixed(3)
    
    if (typeof onProgress === 'function') {
      onProgress(progress, section)
    }
    
    const animators = section.querySelectorAll('[data-scroll-animate], [data-scroll-range]')
    animators.forEach((el: any) => {
      const rangeStr = el.getAttribute('data-scroll-range') || '0,1'
      const [start, end] = rangeStr.split(',').map(Number)
      const localProgress = Math.max(0, Math.min(1, (progress - start) / (end - start)))
      
      el.style.setProperty('--local-progress', localProgress.toString())

      if (typeof el.setScrollProgress === 'function') {
        el.setScrollProgress(localProgress)
      }

      const attr = el.getAttribute('data-scroll-animate')
      if (attr === 'currentTime' && el.duration) {
        el.currentTime = localProgress * el.duration
      } else if (el instanceof BodymovinPlayer || el.tagName.includes('LOTTIE')) {
        if (el.animation) {
          el.animation.goToAndStop(localProgress * el.animation.totalFrames, true)
        }
      } else if (el instanceof B3d || el.tagName.includes('3D')) {
        if (el.scene && el.scene.activeCamera) {
          if (el.scene.activeCamera.alpha !== undefined) {
            el.scene.activeCamera.alpha = localProgress * Math.PI * 2
          }
        }
      } else if (el instanceof MapBox || el.tagName.includes('MAP')) {
        // Direct MapBox logic if needed
      }
    })
  }

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress)
  }, { passive: true })

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
  el.setScrollProgress = options.onProgress
  return el
}
