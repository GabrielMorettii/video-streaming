import { Request, Response } from "express";
import fs from "fs/promises";

import { uploadFileToS3 } from "../libs/aws-s3";

export class UploadFileUseCase {
  async execute(req: Request, res: Response) {
    const file = req.file;

    const result = await uploadFileToS3(file);

    await fs.unlink(file.filepath);

    return res.status(201).json({
      status: "success",
      data: {
        message: "Uploaded successfully!",
        url: result.Location,
      },
    });
  }
}

export default UploadFileUseCase;
