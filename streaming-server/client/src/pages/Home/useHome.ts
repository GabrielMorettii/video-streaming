import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useMutation } from "@apollo/client";

import { UPLOAD_FILE_MUTATION } from "../../gql/mutations/uploadFile";

import { IUploadResponse, PlyrConfigurationProps } from "../../interfaces";

import { NotificationContext } from "../../contexts/NotificationContext";

export function useHome() {
  const { notifications, handleRemoveNotification } =
    useContext(NotificationContext);
  const [fileURL, setFileURL] = useState<string>("");
  const [uploadFile, { data, loading }] =
    useMutation<IUploadResponse>(UPLOAD_FILE_MUTATION);
  const [reload, setReload] = useState<boolean>(false);
  const convertedState = useRef(false);

  const handleUpload = async (files: File[]) => {
    const file = files[0];

    setFileURL(URL.createObjectURL(file));

    await uploadFile({
      variables: {
        file,
      },
    });
  };

  const handleReload = () => {
    setReload((prevState) => !prevState);
  };

  const getConvertedPlayerProps = (data: IUploadResponse) => {
    const { location } = data.uploadFile;

    const fileNameWithoutExt = location
      .slice(location.lastIndexOf("/") + 1)
      .replace(".mp4", "");

    const prefix = `${process.env.CLOUDFRONT_URL}/${fileNameWithoutExt}/${fileNameWithoutExt}`;

    return {
      source: {
        type: "video" as const,
        sources: [
          {
            src: `${prefix}_1080p.mp4`,
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
          },
        ],
      },
      options: {
        autoplay: true,
      },
    };
  };

  const getPlayerProps = useCallback(
    (url: string, _reload: boolean) => {
      if (convertedState.current) {
        return getConvertedPlayerProps(data as IUploadResponse);
      }

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
        options: {
          autoplay: true,
        },
      };
    },
    [data]
  );

  const handleRemoveMedia = useCallback(() => {
    setFileURL("");
  }, []);

  const plyrConfig = useMemo<PlyrConfigurationProps>(() => {
    if (!fileURL) return null;

    return getPlayerProps(fileURL, reload);
  }, [fileURL, getPlayerProps, reload]);

  useEffect(() => {
    const hasContentViolationNotification = notifications.find(
      (notification) =>
        notification.type === "info" &&
        notification.description.includes("impróprio")
    );

    const hasConvertedNotification = notifications.find(
      (notification) =>
        notification.type === "info" &&
        notification.description.includes("convertido")
    );

    if (hasContentViolationNotification) {
      handleRemoveMedia();
    } else if (hasConvertedNotification) {
      convertedState.current = true;
    }
  }, [notifications, handleRemoveMedia]);

  return {
    plyrConfig,
    handleReload,
    handleUpload,
    loading,
    handleRemoveMedia,
    fileURL,
    notifications,
    handleRemoveNotification,
  };
}
