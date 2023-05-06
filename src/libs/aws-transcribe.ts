import { randomUUID } from "node:crypto";
import {
  StartTranscriptionJobCommand,
  TranscribeClient,
  GetTranscriptionJobCommandOutput,
  GetTranscriptionJobCommand,
  TranscriptionJobStatus,
} from "@aws-sdk/client-transcribe";

import { IAddTranscribeJobCommand } from "../interfaces/IAddTranscribeJobCommand";


const client = new TranscribeClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const addTranscribeJob = async ({
  mediaFile,
  lang,
  outputSubtitlesFormats,
}: IAddTranscribeJobCommand) => {
  const transcriptionJobName = randomUUID();

  const response = await client.send(
    new StartTranscriptionJobCommand({
      TranscriptionJobName: transcriptionJobName,
      Media: {
        MediaFileUri: mediaFile,
      },
      OutputBucketName: process.env.S3_BUCKET_NAME,
      ...(lang ? { LanguageCode: lang } : { IdentifyLanguage: true }),
      ...(outputSubtitlesFormats
        ? { Subtitles: { Formats: outputSubtitlesFormats } }
        : {}),
    })
  );
  return { transcriptionJobName, response };
};


const normaliseJobState = ({
  TranscriptionJob,
}: GetTranscriptionJobCommandOutput) => {
  if(!TranscriptionJob) return;

  const status = TranscriptionJob.TranscriptionJobStatus;
  
  if (status === TranscriptionJobStatus.FAILED) {
    return {
      status,
      error: TranscriptionJob.FailureReason,
    };
  }
  if (status === TranscriptionJobStatus.COMPLETED) {
    return {
      status,
      completedWithinSec:
        (new Date(TranscriptionJob.CompletionTime!).getTime() -
        new Date(TranscriptionJob.CreationTime!).getTime())/1000,
      json: TranscriptionJob.Transcript!.TranscriptFileUri,
      subtitleFileUris: TranscriptionJob?.Subtitles?.SubtitleFileUris || [],
    };
  }
  return { status };
};

export const checkTranscribeJobState = async (jobId: string) => {
  const response = await client.send(
    new GetTranscriptionJobCommand({
      TranscriptionJobName: jobId,
    })
  );
  return normaliseJobState(response);
};