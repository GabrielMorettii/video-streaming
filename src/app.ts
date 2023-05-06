import "dotenv/config.js";
import { stat } from "fs/promises";
import { createReadStream } from "fs";
import express from "express";
import path from "path";
import { handleFileUpload } from "./middlewares/formidable";
import {
  addTranscribeJob,
  checkTranscribeJobState,
} from "./libs/aws-transcribe";
import { addSubtitle } from "./libs/ffmpeg";
import UploadFileUseCase from "./services/UploadFileUseCase";

const app = express();

app.use(express.json());

app.get("/video", async (req, res) => {
  const rangeHeader = req.headers.range;

  if (!rangeHeader) {
    res.status(400).send("Range header not found!");
  }

  const mediaPath = path.join(process.cwd(), "src", "assets", "bigbuck.mp4");

  const mediaSize = (await stat(mediaPath)).size;

  const CHUNK_SIZE = 10 ** 6; // 1MB

  const startBytes = Number(rangeHeader!.replace(/\D/g, ""));

  const endBytes = Math.min(startBytes + CHUNK_SIZE, mediaSize - 1);

  const contentLength = endBytes - startBytes + 1;

  const headers = {
    "Content-Range": `bytes ${startBytes}-${endBytes}/${mediaSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  const videoStream = createReadStream(mediaPath, {
    start: startBytes,
    end: endBytes,
  });

  return videoStream.pipe(res);
});

app.post("/upload", handleFileUpload, new UploadFileUseCase().execute);

// app.post("/transcribe", async (req, res) => {
//   const data = req.body;

//   const response = await addTranscribeJob(data);

//   return res.json(response);
// });

// app.post("/transcribe/embed", async (req, res) => {
//   const data = req.body;

//   const outPath = path.join(process.cwd(), "uploads", "video.mp4");

//   data.outPath = outPath;

//   await addSubtitle(data);

//   return res.json({ message: "ok" });
// });

// app.get("/transcribe/status/:jobId", async (req, res) => {
//   const jobId = req.params.jobId;

//   const response = await checkTranscribeJobState(jobId);

//   return res.json(response);
// });

export default app;
