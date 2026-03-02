export const interpolateWaypoints = (progress: number, waypoints: any[]) => {
  if (!waypoints || waypoints.length === 0) return null
  
  waypoints.sort((a, b) => a.progress - b.progress)
  
  if (progress <= waypoints[0].progress) return waypoints[0]
  if (progress >= waypoints[waypoints.length - 1].progress) return waypoints[waypoints.length - 1]
  
  for (let i = 0; i < waypoints.length - 1; i++) {
    const wp1 = waypoints[i]
    const wp2 = waypoints[i + 1]
    if (progress >= wp1.progress && progress <= wp2.progress) {
      const t = (progress - wp1.progress) / (wp2.progress - wp1.progress)
      const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
      
      const result: any = { progress }
      for (const k in wp1) {
        if (k !== 'progress') {
          result[k] = wp1[k] + (wp2[k] - wp1[k]) * e
        }
      }
      return result
    }
  }
  return waypoints[0]
}
