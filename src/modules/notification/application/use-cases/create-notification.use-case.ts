import { Inject, Injectable } from '@nestjs/common';
import { ICreateNotificationUseCase } from '../ports/use-cases/create-notification.use-case.interface';
import { INotificationRepository } from '../ports/repositories/notification-repository.interface';
import { IRealtimeNotificationService } from '../ports/services/realtime-notification.service.interface';
import { INotificationUserQueryService } from '../ports/services/notification-user-query.service.interface';
import { CreateNotificationDto } from '../dto/create-notification.dto';

@Injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
    @Inject('IRealtimeNotificationService')
    private readonly _realtimeService: IRealtimeNotificationService,
    @Inject('INotificationUserQueryService')
    private readonly _userQueryService: INotificationUserQueryService,
  ) {}

  async execute(dto: CreateNotificationDto): Promise<void> {
    let targetUserIds: string[] = [];

    if (dto.userId) {
      /**
       * This is important other wise we dont have
       * server to one targeted client notification
       */
      targetUserIds.push(dto.userId);
    } else if (dto.tenantId) {
      const rolesFilter: string[] =
        dto.roles && dto.roles.length > 0
          ? dto.roles
          : dto.role
            ? [dto.role]
            : [];

      targetUserIds = await this._userQueryService.findUserIdsByTenantAndRoles(
        dto.tenantId,
        rolesFilter,
      );
    }

    const createdNotifications = await Promise.all(
      targetUserIds.map(async (userId) => {
        const notification = await this._notificationRepository.create({
          tenantId: dto.tenantId,
          userId,
          role: dto.role || null,
          type: dto.type,
          title: dto.title,
          message: dto.message,
        });
        return { userId, notification };
      }),
    );

    for (const { userId, notification } of createdNotifications) {
      this._realtimeService.emitToUser(userId, {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        read: false,
        time: 'Just now',
        createdAt: notification.createdAt,
      });
    }
  }
}
