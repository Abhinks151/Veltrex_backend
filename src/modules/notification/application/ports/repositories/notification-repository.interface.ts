import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Notification } from '../../../domain/notification.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../../dto/create-notification.dto';

export interface INotificationRepository extends IBaseRepository<
  Notification,
  CreateNotificationDto,
  UpdateNotificationDto
> {
  findByUserId(userId: string): Promise<Notification[]>;
  markAllRead(userId: string): Promise<void>;
  markAsRead(id: string, userId: string): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
}
