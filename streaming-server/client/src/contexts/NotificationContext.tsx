import { ReactNode, createContext, useCallback, useState } from "react";

export interface Notification {
  id: string;
  type: "error" | "success" | "info";
  description: string;
}

interface NotificationContextProps {
  notifications: Notification[];
  handleAddNotification: (notification: Notification) => void;
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
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const handleAddNotification = useCallback((notification: Notification) => {
    setNotifications((prevState) => [notification, ...prevState]);
  }, []);

  const handleRemoveNotification = useCallback(
    (id: string) => {
      const existentNotification = notifications.find(
        (notificationObj) => notificationObj.id === id
      );

      if (!existentNotification) return;

      setNotifications((prevState) =>
        prevState.filter((notification) => notification.id !== id)
      );
    },
    [notifications]
  );

  return (
    <NotificationContext.Provider
      value={{ notifications, handleAddNotification, handleRemoveNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
