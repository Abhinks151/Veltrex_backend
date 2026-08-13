import { NotificationType } from '../../domain/notification-type.enum';

export class NotificationPayload {
  id!: string;
  title!: string;
  message!: string;
  type!: NotificationType;
  read!: boolean;
  time!: string;
  createdAt!: Date;
}
