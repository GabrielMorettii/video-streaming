import { NextFunction, Request, Response } from "express";
import formidable from "formidable";
import slugify from "slugify";
import { File } from "formidable";

export const handleFileUpload = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const form = formidable({
    uploadDir: "tmp",
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

  req.file = file;

  next();
};
