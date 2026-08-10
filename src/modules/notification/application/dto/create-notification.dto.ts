import { NotificationType } from '../../domain/notification-type.enum';

export class CreateNotificationDto {
  tenantId?: string | null;
  userId?: string | null;
  role?: string | null;
  roles?: string[];
  type!: NotificationType;
  title!: string;
  message!: string;
}

export class UpdateNotificationDto {
  readAt?: Date | null;
}
