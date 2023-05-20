import {
  ReactNode,
  createContext,
  useCallback,
  useEffect,
  useState,
} from "react";

import { socket } from "../lib/socket-io";

import { INotification } from "../interfaces/INotification";
import { EnumSocketEvents } from "../interfaces/EnumSocketEvents";
interface NotificationContextProps {
  notifications: INotification[];
  handleAddNotification: (notification: INotification) => void;
  handleRemoveNotification: (id: string) => void;
}
interface NotificationsProviderProps {
  children: ReactNode;
}

export const NotificationContext = createContext(
  {} as NotificationContextProps
);

export function NotificationsProvider({
  children,
}: NotificationsProviderProps) {
  const [notifications, setNotifications] = useState<INotification[]>([]);

  const emitSocketListEvent = useCallback(() => {
    socket.emit(
      EnumSocketEvents.NOTIFICATION_LIST,
      {},
      (response: INotification[]) => {
        setNotifications(response);
      }
    );
  }, []);

  const handleAddNotification = useCallback((notification: INotification) => {
    setNotifications((prevState) => [notification, ...prevState]);
  }, []);

  const handleRemoveNotification = useCallback(
    (id: string) => {
      const existentNotification = notifications.find(
        (notificationObj) => notificationObj.id === id
      );

      if (!existentNotification) return;

      socket.emit(EnumSocketEvents.NOTIFICATION_UPDATE, { id });

      setNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== id)
      );
    },
    [notifications]
  );

  useEffect(() => {
    socket.on(EnumSocketEvents.NOTIFICATION_CREATED, (data) => {
      handleAddNotification(data);
    });

    socket.on("connect_error", (err) => {
      console.log(`connect_error due to ${err.message}`);
    });

    return () => {
      socket.off(EnumSocketEvents.NOTIFICATION_CREATED);
      socket.off("connect_error");
    };
  }, [handleAddNotification]);

  useEffect(() => {
    emitSocketListEvent();
  }, [emitSocketListEvent]);

  return (
    <NotificationContext.Provider
      value={{ notifications, handleAddNotification, handleRemoveNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
