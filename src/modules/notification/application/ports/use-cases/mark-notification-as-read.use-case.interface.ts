import { Notification } from '../../../domain/notification.entity';

export interface IMarkNotificationAsReadUseCase {
  execute(id: string, userId: string): Promise<Notification>;
}
