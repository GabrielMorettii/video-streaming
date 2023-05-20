export interface IMediaConvertBridgeEvent {
  source: "aws.mediaconvert";
  detail: {
    jobId: string;
  };
}
