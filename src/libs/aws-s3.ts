import AWS from 'aws-sdk'
import { File } from 'formidable';
import fs from 'fs';

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const s3Client = new AWS.S3();

export function generatePresignedUrl(key: string){
  const params = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Expires: 3600
  };

  const url = s3Client.getSignedUrl('getObject', params);

  return url
}

export function uploadFileToS3(file: File) {
  const fileStream = fs.createReadStream(file.filepath);

  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME!,
    Key: file.newFilename,
    Body: fileStream
  };

  return s3Client.upload(uploadParams).promise();
}