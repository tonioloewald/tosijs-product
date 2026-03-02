#!/usr/bin/env bun
import { $ } from 'bun'
import { parseArgs } from 'util'

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    frames: { type: 'string', short: 'f', default: '60' },
    width: { type: 'string', short: 'w', default: '1280' },
    quality: { type: 'string', short: 'q', default: '75' },
    fps: { type: 'string', short: 'r' }
  },
  allowPositionals: true,
})

const input = positionals[0]
if (!input) {
  console.log('Usage: tosi-mosaic <video-file> [options]')
  console.log('Options:')
  console.log('  -f, --frames   Total frames to extract (default: 60)')
  console.log('  -w, --width    Width of each frame (default: 1280)')
  console.log('  -q, --quality  WebP quality (default: 75)')
  console.log('  -r, --fps      Specific input FPS (optional)')
  process.exit(1)
}

try {
  // 1. Get metadata
  const probe = await $`ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,duration,r_frame_rate -of csv=p=0 ${input}`.text()
  const [fpsStr, durationStr, totalFramesStr] = probe.trim().split(',')
  
  const duration = parseFloat(durationStr)
  const targetFrames = parseInt(values.frames!)
  
  // 2. Calculate grid
  const cols = Math.ceil(Math.sqrt(targetFrames))
  const rows = Math.ceil(targetFrames / cols)
  const total = targetFrames
  
  // 3. Generate output filename
  const output = input.replace(/\.[^.]+$/, '') + `_${cols}x${rows}_${total}.webp`
  
  console.log(`🎬 Creating mosaic: ${cols}x${rows} (${total} frames total)`)
  console.log(`📦 Output: ${output}`)

  // 4. Build FFmpeg command
  // select: pick frames evenly spread over the duration
  // scale: resize frames
  // tile: pack into mosaic
  const frameInterval = values.fps ? `1/${values.fps}` : `${total}/duration`
  
  await $`ffmpeg -i ${input} -vf "select='not(mod(n,floor((${totalFramesStr}||1)/${total})))',scale=${values.width}:-1,tile=${cols}x${rows}" -frames:v 1 -q:v ${values.quality} -y ${output}`

  console.log('✅ Done!')
} catch (err) {
  console.error('❌ Error: FFmpeg/FFprobe not found or failed.')
  console.error(err)
}
