import { execFile } from "child_process"

const FFMPEG_PATH = '/usr/bin/ffmpeg'

export function convertVideo(src, out, resolution) {
  const args = [
    "-i", src,
    "-c:v", "libx264",
    "-crf", "26",
    "-s", resolution,
    "-pix_fmt", "yuv420p",
    "-map", "0",
    out
  ]

  return new Promise((resolve, reject) => {
    execFile(FFMPEG_PATH, args, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      resolve(stderr)
    })
  })
}