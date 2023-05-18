import { useDropzone } from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

import { CloudArrowUp } from "phosphor-react";

interface UploadProps {
  onUpload: (files: File[]) => void;
}

export function Upload({ onUpload }: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: {
        "video/mp4": [".mp4"],
      },
      onDropAccepted: onUpload 
    });

  const handleRenderDragMessage = (
    isDragActive: boolean,
    isDragReject: boolean
  ) => {
    if (!isDragActive) {
      return <UploadMessage>Arraste arquivos aqui...</UploadMessage>;
    }

    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }

    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
  };

  return (
    <DropContainer
      $isDragActive={isDragActive}
      $isDragReject={isDragReject}
      {...getRootProps()}
    >
      <input {...getInputProps()} />

      <CloudArrowUp size={150} />

      {handleRenderDragMessage(isDragActive, isDragReject)}
    </DropContainer>
  );
}
