export interface IRekoMessage {
  JobId: string;
  Status: string;
  Video: {
    S3ObjectName: string;
    S3Bucket: string
  }
}