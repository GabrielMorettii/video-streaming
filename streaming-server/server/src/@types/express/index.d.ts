import { File } from "formidable";

declare global {
  declare namespace Express {
    export interface Request {
      file: File;
    }
  }
}
