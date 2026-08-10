import { NotificationType } from './notification-type.enum';

export class Notification {
  constructor(
    public readonly id: string,
    public readonly tenantId: string | null,
    public readonly userId: string | null,
    public readonly role: string | null,
    public readonly type: NotificationType,
    public readonly title: string,
    public readonly message: string,
    public readonly readAt: Date | null,
    public readonly createdAt: Date,
  ) {}
}
