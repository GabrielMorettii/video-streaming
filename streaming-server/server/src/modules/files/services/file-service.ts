import slugify from "slugify";
import { FileUpload } from "graphql-upload";
import { randomUUID } from "crypto";

import AWS from "../../../libs/aws";
import { io } from "../../../app";

const s3Client = new AWS.S3();

export const uploadFileToS3 = async (file: FileUpload) => {
  const { createReadStream, filename } = file;

  const newFileName = slugify(filename, { lower: true });

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: newFileName,
    Body: createReadStream(),
  };

  await new Promise((resolve) => setTimeout(resolve, 3000));

  const response = await s3Client.upload(uploadParams).promise();

  io.emit("notification:created", {
    id: randomUUID(),
    type: "success",
    description: "O upload do vídeo foi um sucesso!",
  });

  return response;
};
