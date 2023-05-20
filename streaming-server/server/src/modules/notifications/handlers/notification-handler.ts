import { Socket } from "socket.io";
import { NotificationsService } from "../services/notifications-service";

import { io } from "../../../app";
import { NotificationDto } from "../dtos/notification-dto";

const notificationsService = new NotificationsService();

export const notificationsHandler = (socket: Socket) => {
  const createNotificationService = (payload: NotificationDto) => {
    return notificationsService.createNotification(io, payload);
  };

  const listNotificationService = (
    payload = {},
    callback: (notifications: NotificationDto[]) => void
  ) => {
    return callback(notificationsService.listNotifications());
  };

  const updateNotificationService = (payload: { id: string }) => {
    return notificationsService.updateNotification(payload.id)
  };

  socket.on("notification:create", createNotificationService);
  socket.on("notification:list", listNotificationService);
  socket.on("notification:update", updateNotificationService);
};
