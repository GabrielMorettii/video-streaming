import { useState } from "react";

import { useMutation } from "@apollo/client";

import Plyr from "plyr-react";

import { X } from "phosphor-react";

import { Upload, Spinner, NotificationCounter } from "../../components";

import { UPLOAD_FILE_MUTATION } from "../../gql/mutations/uploadFile";

import { IUploadResponse } from "../../interfaces/IUploadResponse";

import * as S from "./styles";

export function Home() {
  const [fileURL, setFileURL] = useState<string>("");
  const [uploadFile, { loading }] =
    useMutation<IUploadResponse>(UPLOAD_FILE_MUTATION);

  const handleUpload = async (files: File[]) => {
    const file = files[0];

    setFileURL(URL.createObjectURL(file));

    await uploadFile({
      variables: {
        file,
      },
    });
  };

  const getPlayerProps = (url: string) => {
    return {
      source: {
        type: "video" as const,
        sources: [
          {
            src: url,
            type: "video/mp4",
            provider: "html5" as const,
            size: 1080,
          },
          {
            src: "/01-primo-rico_320p.mp4",
            type: "video/mp4",
            provider: "html5" as const,
            size: 360,
          },
        ],
      },
      options: null,
    };
  };

  const handleCloseVideo = () => {
    setFileURL("");
  };

  return (
    <S.Container>
      <NotificationCounter />

      <S.Title>
        {loading && "Aguarde enquanto o vídeo é processado"}

        {!fileURL && "Faça upload do seu vídeo em formato mp4"}
      </S.Title>

      <S.ContentWrapper>
        {loading && <Spinner />}

        {!fileURL && <Upload onUpload={handleUpload} />}

        {!loading && fileURL && (
          <S.VideoWrapper>
            <X size={23} weight="bold" onClick={handleCloseVideo} />
            <Plyr {...getPlayerProps(fileURL)} />
          </S.VideoWrapper>
        )}
      </S.ContentWrapper>

      {!fileURL && (
        <S.Description>
          Após feito o upload, aguarde alguns instantes para poder visualizar no
          player de vídeo.
        </S.Description>
      )}
    </S.Container>
  );
}
