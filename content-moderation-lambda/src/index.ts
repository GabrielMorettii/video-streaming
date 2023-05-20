import "dotenv/config";
import path from "path";
import { Buffer } from "buffer";
import { SNSEvent } from "aws-lambda";
import { Socket, io } from "socket.io-client";

import * as AWS from "aws-sdk";

import {
  ITranscribeBridgeEvent,
  IRekoMessage,
  ITranscriptBody,
  IMediaConvertBridgeEvent,
} from "./interfaces";

import { badWords } from "./utils/badWords";
import { EnumSocketEvents } from "./interfaces/EnumSocketEvents";

class Handler {
  constructor(
    public rekoSvc: AWS.Rekognition,
    public s3Svc: AWS.S3,
    public transcribeSvc: AWS.TranscribeService,
    public comprehend: AWS.Comprehend,
    public socket: Socket
  ) {}

  async execute(event) {
    const eventHandlers = {
      SNSEvent: () => this.handleSnsEvent(event),
      EventBridgeEvent: () => this.handleEventBridgeEvent(event),
    };

    const eventHandler = !!event.Records
      ? eventHandlers.SNSEvent
      : eventHandlers.EventBridgeEvent;

    await eventHandler();

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          ok: true,
        },
        null,
        2
      ),
    };
  }

  async handleSnsEvent(event: SNSEvent) {
    const snsEvent = event.Records[0].Sns;

    const message: IRekoMessage = JSON.parse(snsEvent.Message);

    if (message.Status === "SUCCEEDED") {
      const JobId = message.JobId;

      const result = await this.rekoSvc
        .getContentModeration({
          JobId,
        })
        .promise();

      const hasBlockedContent = result.ModerationLabels!.length > 0;

      if (hasBlockedContent) {
        const { S3ObjectName: key } = message.Video;

        await this.deleteObjectFromS3Bucket(key);
      }
    }
  }

  async handleEventBridgeEvent(
    event: ITranscribeBridgeEvent | IMediaConvertBridgeEvent
  ) {
    const handlers = {
      "aws.mediaconvert": () => this.handleMediaConvertEvent(),
      "aws.transcribe": () => this.handleTranscribeEvent(event as ITranscribeBridgeEvent),
    };

    return await handlers[event.source]();
  }

  private handleMediaConvertEvent() {
    socket.emit(EnumSocketEvents.NOTIFICATION_CREATE, {
      type: "info",
      description: "Seu vídeo foi convertido para todos os formatos.",
    })
  }

  private async handleTranscribeEvent(event: ITranscribeBridgeEvent) {
    const { TranscriptionJobName, TranscriptionJobStatus: jobStatus } =
      event.detail;

    if (jobStatus === "COMPLETED") {
      const { TranscriptionJob } = await this.transcribeSvc
        .getTranscriptionJob({
          TranscriptionJobName,
        })
        .promise();

      const transcriptUri = TranscriptionJob?.Transcript?.TranscriptFileUri!;

      const match = transcriptUri.match(
        /https:\/\/s3\.([^.]+)\.amazonaws\.com\/([^\/]+)\/(.+)/
      )!;

      const bucketName = match[2];
      const key = match[3];

      const transcriptionResponse = await this.s3Svc
        .getObject({ Bucket: bucketName, Key: key })
        .promise();

      const transcriptionBuffer = transcriptionResponse.Body as Buffer;

      const transcriptionResult = JSON.parse(
        transcriptionBuffer.toString()
      ) as ITranscriptBody;

      const textToAnalyse = transcriptionResult.results.transcripts.reduce(
        (acc, next) => acc + next.transcript,
        ""
      );

      if (textToAnalyse.length === 0) return;

      const result = await this.comprehend
        .detectSentiment({ Text: textToAnalyse, LanguageCode: "pt" })
        .promise();

      const textHasBadWords = this.checkIfTextContainsBadWords(textToAnalyse);

      if (result.Sentiment === "NEGATIVE" || textHasBadWords) {
        const fileName = key.replace("/transcribe.json", ".mp4");

        await this.deleteObjectFromS3Bucket(fileName);
      }
    }
  }

  private async deleteObjectFromS3Bucket(key: string) {
    const [originalBucketName, convertedBucketName] = [
      "gm-videos",
      "gm-converted",
    ];

    await Promise.all([
      this.s3Svc
        .deleteObject({ Bucket: originalBucketName, Key: key })
        .promise(),
      this.emptyS3Directory(convertedBucketName, key),
    ]);

    socket.emit(EnumSocketEvents.NOTIFICATION_CREATE, {
      type: "info",
      description: "Seu vídeo foi removido por conter conteúdo impróprio.",
    });
  }

  private async emptyS3Directory(bucketName: string, fileKey: string) {
    const fileNameWithoutExt = path.basename(fileKey, path.extname(fileKey));

    const listParams = {
      Bucket: bucketName,
      Prefix: `${fileNameWithoutExt}/`,
    };

    const listedObjects = await this.s3Svc.listObjectsV2(listParams).promise();

    if (!listedObjects.Contents || listedObjects.Contents.length === 0) return;

    const deleteParams: {
      Bucket: string;
      Delete: { Objects: { Key: string }[] };
    } = {
      Bucket: bucketName,
      Delete: { Objects: [] },
    };

    listedObjects.Contents.forEach(({ Key }: { Key: string }) => {
      deleteParams.Delete.Objects.push({ Key });
    });

    await s3.deleteObjects(deleteParams).promise();
  }

  private checkIfTextContainsBadWords(text: string) {
    const hasBadWords = badWords.find((word) => {
      if (text.includes(word)) {
        return true;
      }

      return false;
    });

    return !!hasBadWords;
  }
}

const reko = new AWS.Rekognition();
const s3 = new AWS.S3();
const transcribe = new AWS.TranscribeService();
const comprehend = new AWS.Comprehend();
const socket = io(process.env.WS_SERVER_URL!);

const handler = new Handler(reko, s3, transcribe, comprehend, socket);

export const moderate = handler.execute.bind(handler);
