import { Socket } from "socket.io";
import { NotificationsService } from "../services/notifications-service";

import { io } from "../../../app";
import { NotificationDto } from "../dtos/notification-dto";

export const notificationsHandler = (socket: Socket) => {
  const notificationsService = new NotificationsService();

  const createNotificationService = (payload: NotificationDto) => {
    return notificationsService.createNotification(io, payload);
  };

  const listNotificationService = (
    payload = {},
    callback: (notifications: NotificationDto[]) => void
  ) => {
    return callback(notificationsService.listNotifications());
  };

  socket.on("notification:create", createNotificationService);
  socket.on("notification:list", listNotificationService);
};
