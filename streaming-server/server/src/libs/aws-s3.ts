import { File } from "formidable";
import fs from "fs";
import AWS from "./aws";

const s3Client = new AWS.S3();

export function generatePresignedUrl(key: string) {
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 3600,
  };

  const url = s3Client.getSignedUrl("getObject", params);

  return url;
}

export function uploadFileToS3(file: File) {
  const fileStream = fs.createReadStream(file.filepath);

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: file.newFilename,
    Body: fileStream,
  };

  return s3Client.upload(uploadParams).promise();
}