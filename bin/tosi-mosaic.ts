#!/usr/bin/env bun
/*
Convert a video to a WebP/JPG mosaic grid for <tosi-filmstrip>.

Requires `ffmpeg` and `ffprobe` on PATH.

The frame-selection divisor is computed HERE, in JS, rather than inside the
ffmpeg filter expression. It used to be interpolated as
`floor((${nb_frames}||1)/${total})`, which had two failure modes that both
produced a broken or missing mosaic while the process still exited 0:
`nb_frames` is literally `N/A` on plenty of containers (mkv, webm, any stream
without an index), which is not an ffmpeg expression at all; and when the source
has fewer frames than you asked for, the divisor is 0 and `mod(n,0)` divides by
zero. Neither is diagnosable from the ffmpeg error.
*/
import { $ } from "bun";
import { parseArgs } from "util";

const { values, positionals } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    frames: { type: "string", short: "f", default: "60" },
    width: { type: "string", short: "w", default: "1280" },
    quality: { type: "string", short: "q", default: "75" },
    fps: { type: "string", short: "r" },
    format: { type: "string", short: "t", default: "webp" },
  },
  allowPositionals: true,
});

const input = positionals[0];
if (!input) {
  console.log("Usage: tosi-mosaic <video-file> [options]");
  console.log("Options:");
  console.log("  -f, --frames   Total frames to extract (default: 60)");
  console.log("  -w, --width    Width of each frame (default: 1280)");
  console.log("  -q, --quality  Quality 0-100, higher is better (default: 75); mapped per encoder");
  console.log(
    "  -r, --fps      Source FPS, when the container misreports it (optional)"
  );
  console.log(
    "  -t, --format   webp | jpg | png (default: webp). <tosi-filmstrip> reads all three;"
  );
  console.log(
    "                 use jpg or png if your ffmpeg was built without the webp encoder."
  );
  console.log("\nRequires ffmpeg and ffprobe on PATH.");
  process.exit(1);
}

const fail = (msg: string): never => {
  console.error(`❌ ${msg}`);
  process.exit(1);
};

/** `r_frame_rate` is a rational like "24/1" — and "0/0" on streams that don't know. */
function parseRate(s: string | undefined): number {
  if (!s) return NaN;
  const [n, d] = s.split("/").map(Number);
  if (!Number.isFinite(n)) return NaN;
  if (d === undefined) return n;
  return Number.isFinite(d) && d !== 0 ? n / d : NaN;
}

try {
  await $`ffprobe -version`.quiet();
} catch {
  fail(
    "ffprobe not found on PATH. Install ffmpeg (macOS: `brew install ffmpeg`)."
  );
}

try {
  // 1. Metadata. Field order here is ffprobe's, not the order requested:
  //    r_frame_rate, duration, nb_frames.
  const probed =
    await $`ffprobe -v error -select_streams v:0 -show_entries stream=nb_frames,duration,r_frame_rate -of csv=p=0 ${input}`
      .nothrow()
      .quiet();
  if (probed.exitCode !== 0 || !probed.stdout.toString().trim()) {
    const detail = probed.stderr.toString().trim();
    fail(
      `ffprobe could not read a video stream from ${input}.` +
        (detail ? `\n\n${detail}` : " Is it a video file?")
    );
  }
  const [fpsStr, durationStr, nbFramesStr] = probed.stdout
    .toString()
    .trim()
    .split(",");

  const targetFrames = parseInt(values.frames!);
  if (!Number.isFinite(targetFrames) || targetFrames < 1) {
    fail(`--frames must be a positive integer (got ${values.frames}).`);
  }

  // 2. How many frames does the source actually have?
  //    nb_frames is authoritative when present, but it is `N/A` on many
  //    containers — fall back to duration x fps, and let --fps override a
  //    container that misreports its rate.
  const fps = parseRate(values.fps ?? fpsStr);
  const duration = parseFloat(durationStr);
  const nbFrames = Number(nbFramesStr);
  let sourceFrames = Number.isFinite(nbFrames) && nbFrames > 0
    ? nbFrames
    : Number.isFinite(duration) && Number.isFinite(fps)
      ? Math.floor(duration * fps)
      : NaN;

  /*
  Last resort: count the frames. Containers exist (remuxed mkv/webm, streams with
  no index) that report BOTH `nb_frames=N/A` and `duration=N/A`, and for those
  neither the metadata nor duration x fps can answer. This decodes the stream, so
  it is slow — hence the fallback position and the warning, rather than doing it
  every time. The previous code told the user to pass --fps here, which does not
  help when duration is the missing half.
  */
  if (!Number.isFinite(sourceFrames) || sourceFrames < 1) {
    console.warn(
      `⚠️  ${input} reports neither a frame count nor a duration — counting frames (this decodes the whole file)…`
    );
    const counted =
      await $`ffprobe -v error -select_streams v:0 -count_frames -show_entries stream=nb_read_frames -of csv=p=0 ${input}`
        .nothrow()
        .quiet();
    sourceFrames = Number(counted.stdout.toString().trim());
  }

  if (!Number.isFinite(sourceFrames) || sourceFrames < 1) {
    fail(
      `Could not determine the frame count of ${input} ` +
        `(nb_frames=${nbFramesStr}, duration=${durationStr}, r_frame_rate=${fpsStr}, and counting frames failed). ` +
        `Is it a video file?`
    );
  }

  // 3. Take every Nth frame. Never less than 1 — a source with fewer frames
  //    than requested yields all of them, which is the best available answer.
  const stride = Math.max(1, Math.floor(sourceFrames / targetFrames));
  /*
  The grid is sized from what `select` will actually EMIT, not from what was
  requested. Sizing it from `targetFrames` truncates the clip: at 90 source
  frames and `-f 60` the stride is 1, so select emits all 90, an 8x8 grid takes
  the first 64, `-frames:v 1` drops the rest — and the filename still claims 60,
  so <tosi-filmstrip> scrubs the front two-thirds of the video and calls it the
  whole thing. `select` can only take every Nth frame, so the count lands on a
  multiple of the stride rather than exactly on the request; overshooting by a
  few frames is right, silently losing the end of the clip is not.
  */
  const total = Math.ceil(sourceFrames / stride);
  if (total !== targetFrames) {
    console.warn(
      `⚠️  ${input} has ${sourceFrames} frames; every ${stride}${stride === 1 ? "" : stride === 2 ? "nd" : stride === 3 ? "rd" : "th"} frame gives ${total}, not the ${targetFrames} requested. Using ${total} so the whole clip is covered.`
    );
  }

  const cols = Math.ceil(Math.sqrt(total));
  const rows = Math.ceil(total / cols);

  // <tosi-filmstrip> parses `_COLSxROWS_TOTAL.(webp|jpg|png)` out of the filename,
  // so the extension is the only part that varies. webp is the right default;
  // jpg/png exist because plenty of ffmpeg builds ship without a webp encoder,
  // and finding that out used to cost an opaque "exit code 8".
  const format = (values.format || "webp").toLowerCase().replace(/^\./, "");
  if (!["webp", "jpg", "png"].includes(format)) {
    fail(`--format must be webp, jpg or png (got ${values.format}).`);
  }
  const output =
    input.replace(/\.[^.]+$/, "") + `_${cols}x${rows}_${total}.${format}`;

  /*
  `--quality` is a 0-100 scale, and only webp reads it that way. mjpeg's `-q:v`
  is a 1-31 qscale where LOWER is better and anything past 31 clamps, so passing
  75 or 90 straight through produced byte-identical, worst-possible JPEGs (same
  md5 at -q 75 and -q 90; only <=31 moves at all). PNG ignores `-q:v` entirely
  and wants `-compression_level` (0-9), where the trade is size against encode
  time, not fidelity.
  */
  const qRaw = Number(values.quality);
  const q = Number.isFinite(qRaw) ? Math.min(100, Math.max(0, qRaw)) : 75;
  const encoderArgs =
    format === "webp"
      ? ["-q:v", String(q)]
      : format === "jpg"
        ? ["-q:v", String(Math.min(31, Math.max(2, Math.round(31 - (q / 100) * 29))))]
        : ["-compression_level", String(Math.min(9, Math.max(0, Math.round(9 - (q / 100) * 9))))];

  console.log(`🎬 Creating mosaic: ${cols}x${rows} (${total} frames total)`);
  console.log(`📦 Output: ${output}`);

  const run =
    await $`ffmpeg -v error -i ${input} -vf ${`select='not(mod(n\\,${stride}))',scale=${values.width}:-1,tile=${cols}x${rows}`} -frames:v 1 ${encoderArgs} -y ${output}`
      .nothrow()
      .quiet();

  /*
  ffmpeg's stderr is the whole diagnosis, and `.quiet()` alone throws away the
  one line that says what went wrong — "Default encoder for format webp is
  probably disabled" reached the user as "Failed with exit code 8". Capture it
  and print it.
  */
  if (run.exitCode !== 0) {
    const detail = run.stderr.toString().trim();
    fail(`ffmpeg failed (exit ${run.exitCode}).${detail ? `\n\n${detail}` : ""}`);
  }

  console.log("✅ Done!");
} catch (err) {
  // Exiting 0 here meant `tosi-mosaic in.mp4 && deploy` shipped a broken or
  // missing filmstrip without anyone noticing.
  console.error("❌ Error: ffmpeg/ffprobe failed.");
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
}
