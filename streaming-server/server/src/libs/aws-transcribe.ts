import { randomUUID } from "node:crypto";

import { IAddTranscribeJobCommand } from "../interfaces/IAddTranscribeJobCommand";

import AWS from "./aws";

import {
  GetTranscriptionJobResponse,
  TranscriptionJobStatus,
} from "aws-sdk/clients/transcribeservice";

const client = new AWS.TranscribeService();

export const addTranscribeJob = async ({
  mediaFile,
  lang,
  outputSubtitlesFormats,
}: IAddTranscribeJobCommand) => {
  const transcriptionJobName = randomUUID();

  const response = await client
    .startTranscriptionJob({
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
    .promise();

  return { transcriptionJobName, response };
};

const normaliseJobState = ({
  TranscriptionJob,
}: GetTranscriptionJobResponse) => {
  if (!TranscriptionJob) return;

  const status: TranscriptionJobStatus =
    TranscriptionJob.TranscriptionJobStatus!;

  if (status === "FAILED") {
    return {
      status,
      error: TranscriptionJob.FailureReason,
    };
  }
  if (status === "COMPLETED") {
    return {
      status,
      completedWithinSec:
        (new Date(TranscriptionJob.CompletionTime!).getTime() -
          new Date(TranscriptionJob.CreationTime!).getTime()) /
        1000,
      json: TranscriptionJob.Transcript!.TranscriptFileUri,
      subtitleFileUris: TranscriptionJob?.Subtitles?.SubtitleFileUris || [],
    };
  }
  return { status };
};

export const checkTranscribeJobState = async (jobId: string) => {
  const response = await client
    .getTranscriptionJob({
      TranscriptionJobName: jobId,
    })
    .promise();

  return normaliseJobState(response);
};
