import { Inject, Injectable } from '@nestjs/common';
import { IMarkAllNotificationsAsReadUseCase } from '../ports/use-cases/mark-all-notifications-as-read.use-case.interface';
import { INotificationRepository } from '../ports/repositories/notification-repository.interface';

@Injectable()
export class MarkAllNotificationsAsReadUseCase implements IMarkAllNotificationsAsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    await this._notificationRepository.markAllRead(userId);
  }
}
