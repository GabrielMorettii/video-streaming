export interface ITranscribeBridgeEvent {
  source: "aws.transcribe";
  detail: {
    TranscriptionJobName: string;
    TranscriptionJobStatus: string;
  };
}
