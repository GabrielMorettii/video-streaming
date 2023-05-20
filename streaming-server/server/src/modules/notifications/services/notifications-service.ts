import { Server } from "socket.io";
import { randomUUID } from "crypto";
import { NotificationDto } from "../dtos/notification-dto";

export class NotificationsService {
  private notifications: NotificationDto[] = []

  createNotification(io: Server, payload: NotificationDto) {
    const notification = {
      id: randomUUID(),
      type: payload.type,
      description: payload.description,
    };

    this.notifications.push(notification);

    io.emit("notification:created", notification);
  }

  listNotifications() {
    return this.notifications;
  }
}
