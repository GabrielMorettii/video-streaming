import "dotenv/config.js";
import express from "express";
import { handleFileUpload } from "./middlewares/formidable";
import UploadFileUseCase from "./services/UploadFileUseCase";

const app = express();

app.use(express.json());

app.post("/upload", handleFileUpload, new UploadFileUseCase().execute);

export default app;
