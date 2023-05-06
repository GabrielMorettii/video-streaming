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

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  const documentPath = path.join(process.cwd(), "src", "index.html");

  return res.sendFile(documentPath);
});

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

app.post("/upload", handleFileUpload, (req, res) => {
  return res.send();
});

app.post("/transcribe", async (req, res) => {
  const data = req.body;

  const response = await addTranscribeJob(data);

  return res.json(response);
});

app.get("/transcribe/status/:jobId", async (req, res) => {
  const jobId = req.params.jobId;

  const response = await checkTranscribeJobState(jobId);

  return res.json(response);
});

export default app;
