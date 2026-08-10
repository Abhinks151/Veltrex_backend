import { Notification } from '../../../domain/notification.entity';

export interface IGetMyNotificationsUseCase {
  execute(userId: string): Promise<Notification[]>;
}
