import { PlyrOptions, PlyrSource } from "plyr-react";

export type PlyrConfigurationProps = {
  source: PlyrSource | null;
  options?: PlyrOptions | null;
} | null