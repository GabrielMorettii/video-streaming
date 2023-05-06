import { execFile } from "child_process"

export function convertVideo(src: string, out: string, resolution: string) {
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
    execFile(process.env.FFMPEG_BIN_PATH!, args, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      resolve(stderr)
    })
  })
}

export const RESOLUTIONS = [
  { size: "720p", dimensions: "1280x720" },
  { size: "360p", dimensions: "640x360" },
  { size: "144p", dimensions: "256x144" }
]