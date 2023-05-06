import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import slugify from "slugify";
import path from "path";
import { File } from "formidable";

import { RESOLUTIONS, convertVideo } from "../libs/ffmpeg";

export const handleFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const form = formidable({
    uploadDir: "uploads",
    keepExtensions: true,
    filename(name, ext, part, form) {
      return `${slugify(name)}${ext}`;
    },
    filter: function ({ name, originalFilename, mimetype }) {
      return (mimetype && mimetype.includes("video")) || false;
    },
  });

  const file: File = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }

      resolve(Object.values(files)[0] as File);
    });
  });

  const originalFilePath = file.filepath;

  const extName = path.extname(originalFilePath);

  const fileNameWithoutExt = path.basename(file.originalFilename!, extName);

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
