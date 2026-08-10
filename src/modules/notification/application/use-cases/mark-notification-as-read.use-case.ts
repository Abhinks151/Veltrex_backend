import { Inject, Injectable } from '@nestjs/common';
import { IMarkNotificationAsReadUseCase } from '../ports/use-cases/mark-notification-as-read.use-case.interface';
import { INotificationRepository } from '../ports/repositories/notification-repository.interface';
import { Notification } from '../../domain/notification.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class MarkNotificationAsReadUseCase implements IMarkNotificationAsReadUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
  ) {}

  async execute(id: string, userId: string): Promise<Notification> {
    const existing = await this._notificationRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.NOTIFICATION_NOT_FOUND);
    }

    return this._notificationRepository.markAsRead(id, userId);
  }
}
