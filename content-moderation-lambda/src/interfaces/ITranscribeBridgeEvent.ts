export interface ITranscribeBridgeEvent {
  detail: {
    TranscriptionJobName: string;
    TranscriptionJobStatus: string;
  };
}
