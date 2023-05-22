import { useCallback, useState } from "react";

import { useMutation } from "@apollo/client";

import Plyr from "plyr-react";

import { X } from "phosphor-react";

import { Upload, Spinner, NotificationCounter } from "../../components";

import { UPLOAD_FILE_MUTATION } from "../../gql/mutations/uploadFile";

import { IUploadResponse } from "../../interfaces/IUploadResponse";

import * as S from "./styles";

export function Home() {
  const [fileURL, setFileURL] = useState<string>("");
  const [isFileConverted, setIsFileConverted] = useState<boolean>(false);
  const [uploadFile, { loading, data }] =
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

  const getConvertedPlayerProps = (url: string, data: IUploadResponse) => {
    const { location } = data.uploadFile;

    const fileNameWithoutExt = location.slice(location.lastIndexOf('/') + 1).replace('.mp4', '');

    const prefix = `${process.env.CLOUDFRONT_URL}/${fileNameWithoutExt}/${fileNameWithoutExt}`;

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
            src: `${prefix}_720p.mp4`,
            type: "video/mp4",
            provider: "html5" as const,
            size: 720,
          },
          {
            src: `${prefix}_320p.mp4`,
            type: "video/mp4",
            provider: "html5" as const,
            size: 360,
          }
        ],
      },
      options: null,
    };
  };

  const getInitialPlayerProps = (url: string) => {
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
        ],
      },
      options: null,
    };
  };

  const handleRemoveMedia = useCallback(() => {
    setFileURL("");
  }, []);

  const handleReloadMedia = useCallback(() => {
    setIsFileConverted(true);
  }, []);

  return (
    <S.Container>
      <NotificationCounter
        onRemoveMedia={handleRemoveMedia}
        onReloadMedia={handleReloadMedia}
      />

      <S.Title>
        {loading && "Aguarde enquanto o vídeo é processado"}

        {!fileURL && "Faça upload do seu vídeo em formato mp4"}
      </S.Title>

      <S.ContentWrapper>
        {loading && <Spinner />}

        {!fileURL && <Upload onUpload={handleUpload} />}

        {!loading && fileURL && (
          <S.VideoWrapper>
            <X size={23} weight="bold" onClick={handleRemoveMedia} />

            {!isFileConverted && <Plyr {...getInitialPlayerProps(fileURL)} />}

            {isFileConverted && data && <Plyr {...getConvertedPlayerProps(fileURL, data as IUploadResponse)} />}

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
