import { LanguageCode, SubtitleFormat } from "@aws-sdk/client-transcribe";

export interface IAddTranscribeJobCommand{
  mediaFile: string;
  lang?: LanguageCode | string;
  outputSubtitlesFormats: (string | SubtitleFormat)[];
};
