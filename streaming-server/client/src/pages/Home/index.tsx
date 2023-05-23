import Plyr from "plyr-react";

import { CircleNotch, X } from "phosphor-react";

import { Upload, Spinner, NotificationCounter } from "../../components";

import * as S from "./styles";

import { useHome } from "./useHome";

export function Home() {
  const {
    notifications,
    plyrConfig,
    loading,
    fileURL,
    handleReload,
    handleRemoveMedia,
    handleRemoveNotification,
    handleUpload,
  } = useHome();

  return (
    <S.Container>
      <NotificationCounter
        notifications={notifications}
        handleRemoveNotification={handleRemoveNotification}
      />

      <S.Title>
        {loading && "Aguarde enquanto o vídeo é processado"}

        {!fileURL && "Faça upload do seu vídeo em formato mp4"}
      </S.Title>

      <S.ContentWrapper>
        {loading && <Spinner />}

        {!fileURL && <Upload onUpload={handleUpload} />}

        {!loading && plyrConfig && (
          <S.VideoWrapper>
            <S.IconsWrapper>
              <CircleNotch weight="bold" onClick={handleReload} />
              <X weight="bold" onClick={handleRemoveMedia} />
            </S.IconsWrapper>

            <Plyr {...plyrConfig} />
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
