import { Inject, Injectable } from '@nestjs/common';
import { IGetMyNotificationsUseCase } from '../ports/use-cases/get-my-notifications.use-case.interface';
import { INotificationRepository } from '../ports/repositories/notification-repository.interface';
import { Notification } from '../../domain/notification.entity';

@Injectable()
export class GetMyNotificationsUseCase implements IGetMyNotificationsUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<Notification[]> {
    return this._notificationRepository.findByUserId(userId);
  }
}
