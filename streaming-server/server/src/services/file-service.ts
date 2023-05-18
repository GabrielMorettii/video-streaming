import slugify from 'slugify';
import AWS from '../libs/aws'
import { FileUpload } from "graphql-upload";

const s3Client = new AWS.S3();

export const uploadFileToS3 = async (file: FileUpload) => { 
  const { createReadStream, filename } = file;

  const newFileName = slugify(filename, { lower: true });

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: newFileName,
    Body: createReadStream(),
  };

  await new Promise(resolve => setTimeout(resolve, 3000))

  // s3Client.upload(uploadParams).promise();

  return {
    Location: "google.com"
  }
}