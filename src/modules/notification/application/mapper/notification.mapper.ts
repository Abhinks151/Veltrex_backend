import { Notification } from '../../domain/notification.entity';
import { NotificationType } from '../../domain/notification-type.enum';

export interface RawNotification {
  id: string;
  tenantId: string | null;
  userId: string | null;
  role: string | null;
  type: string;
  title: string;
  message: string;
  readAt: Date | null;
  createdAt: Date;
}

export const toNotificationMapper = (raw: RawNotification): Notification => {
  return new Notification(
    raw.id,
    raw.tenantId,
    raw.userId,
    raw.role,
    raw.type as NotificationType,
    raw.title,
    raw.message,
    raw.readAt,
    raw.createdAt,
  );
};
