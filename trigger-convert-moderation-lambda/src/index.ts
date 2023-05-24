import { S3Event, APIGatewayProxyResult } from "aws-lambda";

import * as AWS from "aws-sdk";

import path from "node:path";
import crypto from "node:crypto";

class Handler {
  constructor(
    public transcribeSvc: AWS.TranscribeService,
    public rekoSvc: AWS.Rekognition,
    public mediaConvert: AWS.MediaConvert
  ) {}

  async execute(event: S3Event): Promise<APIGatewayProxyResult> {
    const [
      {
        s3: {
          bucket: { name },
          object: { key },
        },
      },
    ] = event.Records;

    const mediaParams = this.getMediaConvertParams(key);

    const rekoParams = this.getRekognitionParams(name, key);

    const transcribeParams = this.getTranscriptionParams(name, key);

    const [responseMedia, responseReko, responseTranscribe] = await Promise.all([
      this.mediaConvert.createJob(mediaParams).promise(),
      this.rekoSvc.startContentModeration(rekoParams).promise(),
      this.transcribeSvc.startTranscriptionJob(transcribeParams).promise(),
    ]);
    
    console.log(JSON.stringify({ responseMedia }, null, 2));
    console.log(JSON.stringify({ responseReko }, null, 2));
    console.log(JSON.stringify({ responseTranscribe }, null, 2));

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

  private getMediaConvertParams(fileKey: string) {
    const fileNameWithoutExt = path.basename(fileKey, path.extname(fileKey));

    const outputBucketName = `${process.env
      .OUTPUT_BUCKET_NAME!}/${fileNameWithoutExt}`;

    const inputBucketName = process.env.INPUT_BUCKET_NAME!;

    const params: AWS.MediaConvert.Types.CreateJobRequest = {
      Role: process.env.MEDIA_ROLE_ARN!,
      Settings: {
        OutputGroups: [
          {
            Name: "360p",
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {
                    CslgAtom: "INCLUDE",
                    FreeSpaceBox: "EXCLUDE",
                    MoovPlacement: "PROGRESSIVE_DOWNLOAD",
                  },
                },
                VideoDescription: {
                  ColorMetadata: "INSERT",
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      Bitrate: 800000,
                      CodecLevel: "AUTO",
                      CodecProfile: "MAIN",
                      RateControlMode: "CBR",
                      SceneChangeDetect: "ENABLED",
                      GopSize: 90,
                      GopClosedCadence: 1,
                      GopBReference: "DISABLED",
                      GopSizeUnits: "FRAMES",
                      ParControl: "INITIALIZE_FROM_SOURCE",
                      NumberBFramesBetweenReferenceFrames: 2,
                      RepeatPps: "DISABLED",
                      Syntax: "DEFAULT",
                      Softness: 0,
                      EntropyEncoding: "CABAC",
                    },
                  },
                  Height: 360,
                  Width: 640,
                },
                AudioDescriptions: [
                  {
                    AudioTypeControl: "FOLLOW_INPUT",
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: "NORMAL",
                        Bitrate: 96000,
                        RateControlMode: "CBR",
                        CodecProfile: "LC",
                        CodingMode: "CODING_MODE_2_0",
                        RawFormat: "NONE",
                        SampleRate: 48000,
                        Specification: "MPEG4",
                      },
                    },
                    LanguageCodeControl: "FOLLOW_INPUT",
                  },
                ],
                NameModifier: "_320p",
              },
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: `s3://${outputBucketName}/`,
              },
            },
          },
          {
            Name: "720p",
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {
                    CslgAtom: "INCLUDE",
                    FreeSpaceBox: "EXCLUDE",
                    MoovPlacement: "PROGRESSIVE_DOWNLOAD",
                  },
                },
                VideoDescription: {
                  ColorMetadata: "INSERT",
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      Bitrate: 1500000,
                      CodecLevel: "AUTO",
                      CodecProfile: "MAIN",
                      RateControlMode: "CBR",
                      SceneChangeDetect: "ENABLED",
                      GopSize: 90,
                      GopClosedCadence: 1,
                      GopBReference: "DISABLED",
                      GopSizeUnits: "FRAMES",
                      ParControl: "INITIALIZE_FROM_SOURCE",
                      NumberBFramesBetweenReferenceFrames: 2,
                      RepeatPps: "DISABLED",
                      Syntax: "DEFAULT",
                      Softness: 0,
                      EntropyEncoding: "CABAC",
                    },
                  },
                  Height: 720,
                  Width: 1280,
                },
                AudioDescriptions: [
                  {
                    AudioTypeControl: "FOLLOW_INPUT",
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: "NORMAL",
                        Bitrate: 96000,
                        RateControlMode: "CBR",
                        CodecProfile: "LC",
                        CodingMode: "CODING_MODE_2_0",
                        RawFormat: "NONE",
                        SampleRate: 48000,
                        Specification: "MPEG4",
                      },
                    },
                    LanguageCodeControl: "FOLLOW_INPUT",
                  },
                ],
                NameModifier: "_720p",
              },
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: `s3://${outputBucketName}/`,
              },
            },
          },
          {
            Name: "1080p",
            Outputs: [
              {
                ContainerSettings: {
                  Container: "MP4",
                  Mp4Settings: {
                    CslgAtom: "INCLUDE",
                    FreeSpaceBox: "EXCLUDE",
                    MoovPlacement: "PROGRESSIVE_DOWNLOAD",
                  },
                },
                VideoDescription: {
                  ColorMetadata: "INSERT",
                  CodecSettings: {
                    Codec: "H_264",
                    H264Settings: {
                      Bitrate: 3500000,
                      CodecLevel: "AUTO",
                      CodecProfile: "MAIN",
                      RateControlMode: "CBR",
                      SceneChangeDetect: "ENABLED",
                      GopSize: 90,
                      GopClosedCadence: 1,
                      GopBReference: "DISABLED",
                      GopSizeUnits: "FRAMES",
                      ParControl: "INITIALIZE_FROM_SOURCE",
                      NumberBFramesBetweenReferenceFrames: 2,
                      RepeatPps: "DISABLED",
                      Syntax: "DEFAULT",
                      Softness: 0,
                      EntropyEncoding: "CABAC",
                    },
                  },
                  Height: 1080,
                  Width: 1920,
                },
                AudioDescriptions: [
                  {
                    AudioTypeControl: "FOLLOW_INPUT",
                    CodecSettings: {
                      Codec: "AAC",
                      AacSettings: {
                        AudioDescriptionBroadcasterMix: "NORMAL",
                        Bitrate: 96000,
                        RateControlMode: "CBR",
                        CodecProfile: "LC",
                        CodingMode: "CODING_MODE_2_0",
                        RawFormat: "NONE",
                        SampleRate: 48000,
                        Specification: "MPEG4",
                      },
                    },
                    LanguageCodeControl: "FOLLOW_INPUT",
                  },
                ],
                NameModifier: "_1080p",
              },
            ],
            OutputGroupSettings: {
              Type: "FILE_GROUP_SETTINGS",
              FileGroupSettings: {
                Destination: `s3://${outputBucketName}/`,
              },
            },
          },
        ],
        AdAvailOffset: 0,
        Inputs: [
          {
            AudioSelectors: {
              "Audio Selector 1": {
                Offset: 0,
                DefaultSelection: "DEFAULT",
                ProgramSelection: 1,
              },
            },
            VideoSelector: {
              ColorSpace: "FOLLOW",
            },
            FilterEnable: "AUTO",
            PsiControl: "USE_PSI",
            FilterStrength: 0,
            DeblockFilter: "DISABLED",
            DenoiseFilter: "DISABLED",
            TimecodeSource: "EMBEDDED",
            FileInput: `s3://${inputBucketName}/${fileKey}`,
          },
        ],
      },
    };

    return params;
  }

  private getRekognitionParams(bucketName: string, fileKey: string) {
    const params: AWS.Rekognition.Types.StartContentModerationRequest = {
      Video: {
        S3Object: {
          Bucket: bucketName,
          Name: fileKey,
        },
      },
      NotificationChannel: {
        SNSTopicArn: process.env.TOPIC_ARN!,
        RoleArn: process.env.REKO_ROLE_ARN!,
      },
      MinConfidence: 80,
    };

    return params;
  }

  private getTranscriptionParams(bucketName: string, fileKey: string) {
    const outputBucketName = process.env.OUTPUT_BUCKET_NAME!;

    const fileNameWithoutExt = path.basename(fileKey, path.extname(fileKey));

    const params: AWS.TranscribeService.Types.StartTranscriptionJobRequest = {
      TranscriptionJobName: crypto.randomUUID(),
      LanguageCode: "pt-BR",
      Media: {
        MediaFileUri: `s3://${bucketName}/${fileKey}`,
      },
      OutputBucketName: `${outputBucketName}`,
      OutputKey: `${fileNameWithoutExt}/transcribe.json`,
    };

    return params;
  }
}

new AWS.Config({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

const transcribe = new AWS.TranscribeService();
const reko = new AWS.Rekognition();

const mediaConvert = new AWS.MediaConvert({
  endpoint: process.env.MEDIA_CONVERT_ENDPOINT,
});

const handler = new Handler(transcribe, reko, mediaConvert);

export const s3listener = handler.execute.bind(handler);
