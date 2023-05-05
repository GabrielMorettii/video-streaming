import { stat } from "fs/promises";
import { createReadStream } from "fs";
import express from "express";
import path from "path";
import formidable from "formidable";
import slugify from "slugify";
import { RESOLUTIONS } from "./utils/resolutions.js";
import { convertVideo } from "./utils/convertVideo.js";

const app = express();

const formidableMiddleware = async (req, res, next) => {
  const form = formidable({
    uploadDir: "uploads",
    keepExtensions: true,
    filename(name, ext, part, form) {
      return `${slugify(name)}${ext}`;
    },
    filter: function ({ name, originalFilename, mimetype }) {
      return mimetype && mimetype.includes("video");
    },
  });

  const file = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      resolve(Object.values(files)[0]);
    });
  });

  const originalFilePath = file.filepath;

  const extName = path.extname(originalFilePath);

  const fileNameWithoutExt = path.basename(file.originalFilename, extName);

  const pathsToResolution = RESOLUTIONS.map(({ size, dimensions }) => {
    return {
      dimensions,
      filePath: `${fileNameWithoutExt}__${size}${extName}`,
    };
  });

  await Promise.all(
    pathsToResolution.map(({ filePath, dimensions }) =>
      convertVideo(originalFilePath, `uploads/${filePath}`, dimensions)
    )
  );

  next();
};

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

  const startBytes = Number(rangeHeader.replace(/\D/g, ""));

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

app.post("/upload", formidableMiddleware, (req, res) => {
  return res.send();
});

app.listen(5000, () => {
  console.log("Listening on port 5000!");
});
