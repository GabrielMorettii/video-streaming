import { execFile } from "child_process"
import { IAddSubtitle } from "../interfaces/IAddSubtitle"
import { generatePresignedUrl } from "./aws-s3"

export const RESOLUTIONS = [
  { size: "720p", dimensions: "1280x720" },
  { size: "360p", dimensions: "640x360" },
  { size: "144p", dimensions: "256x144" }
]

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

  return executeFFmpegCommand(args)
}

export function addSubtitle({videoKey, subtitleKey, outPath}: IAddSubtitle){
  const args = [
    "-i", generatePresignedUrl(videoKey),
    "-i", generatePresignedUrl(subtitleKey),
    "-map", "0:v",
    "-map", "0:a",
    "-map", "1",
    "-c", "copy",
    "-c:s", "mov_text",
    "-metadata:s:s:0", "language=eng",
    outPath
  ]

  return executeFFmpegCommand(args)
}

function executeFFmpegCommand(args: string[]){
  return new Promise((resolve, reject) => {
    execFile(process.env.FFMPEG_BIN_PATH!, args, (error, stdout, stderr) => {
      if (error) {
        return reject(error)
      }

      resolve(stderr)
    })
  })
}