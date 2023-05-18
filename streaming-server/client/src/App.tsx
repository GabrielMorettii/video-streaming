import { useRef, useState } from "react";

import { useMutation } from "@apollo/client";

import { Upload } from "./components/Upload";

import { UPLOAD_FILE_MUTATION } from "./gql/mutations/uploadFile";

import { Container, Description, ContentWrapper, Title } from "./styles/app";
import { Spinner } from "./components/Spinner";
import { IUploadResponse } from "./interfaces/IUploadResponse";

import Plyr from "plyr-react";

import "plyr-react/plyr.css";

function App() {
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
      id: "video-player",
      source: {
        type: "video" as const,
        sources: [
          {
            src: url,
            type: 'video/mp4',
            provider: "html5" as const,
            size: 1080,
          },
          // {
          //   src: "/01-primo-rico_320p.mp4",
          //   type: 'video/mp4',
          //   provider: "html5" as const,
          //   size: 360,
          // },
        ]
      }, 
      options: null, 
    }
  }

  return (
    <Container>
      <Title>
        {loading && "Aguarde enquanto o vídeo é processado"}

        {!fileURL && "Faça upload do seu vídeo em formato mp4"}
      </Title>

      <ContentWrapper>
        {loading && <Spinner />}

        {!fileURL && <Upload onUpload={handleUpload} />}

        {!loading && fileURL && (
          <Plyr {...getPlayerProps(fileURL)} />
        )}
      </ContentWrapper>

      <Description>
        Após feito o upload, aguarde alguns instantes para poder visualizar no
        player de vídeo.
      </Description>
    </Container>
  );
}

export default App;
