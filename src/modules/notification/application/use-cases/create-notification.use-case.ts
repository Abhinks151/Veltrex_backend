import { Inject, Injectable } from '@nestjs/common';
import { ICreateNotificationUseCase } from '../ports/use-cases/create-notification.use-case.interface';
import { INotificationRepository } from '../ports/repositories/notification-repository.interface';
import { NotificationSseService } from '../../infrastructure/services/notification-sse.service';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Role } from '@/shared/enums';

@Injectable()
export class CreateNotificationUseCase implements ICreateNotificationUseCase {
  constructor(
    @Inject('INotificationRepository')
    private readonly _notificationRepository: INotificationRepository,
    private readonly _sseService: NotificationSseService,
    private readonly _prisma: PrismaService,
  ) {}

  async execute(dto: CreateNotificationDto): Promise<void> {
    let targetUserIds: string[] = [];

    // 1. Resolve targeted Users
    if (dto.userId) {
      targetUserIds.push(dto.userId);
    } else if (dto.tenantId) {
      let rolesFilter: string[] = [];
      if (dto.roles && dto.roles.length > 0) {
        rolesFilter = dto.roles;
      } else if (dto.role) {
        rolesFilter = [dto.role];
      }

      const rolesFilterAsEnum = rolesFilter as Role[];

      // const targetUsers = await this._prisma.user.findMany({
      //   where: {
      //     isDeleted: false,
      //     isBlocked: false,
      //     OR: [
      //       {
      //         tenantId: dto.tenantId,
      //         ...(rolesFilterAsEnum.length > 0
      //           ? { role: { in: rolesFilterAsEnum } }
      //           : {}),
      //       },
      //       {
      //         ownedTenant: { id: dto.tenantId },
      //         ...(rolesFilterAsEnum.length > 0
      //           ? { role: { in: rolesFilterAsEnum } }
      //           : {}),
      //       },
      //     ],
      //   },
      //   select: { id: true },
      // });

      const roleFilter =
        rolesFilter.length > 0 ? { role: { in: rolesFilterAsEnum } } : {};

      const tenantMemberFilter = {
        tenantId: dto.tenantId,
        ...roleFilter,
      };

      const tenantOwnerFilter = {
        ownedTenant: {
          id: dto.tenantId,
        },
        ...roleFilter,
      };

      const targetUsers = await this._prisma.user.findMany({
        where: {
          isDeleted: false,
          isBlocked: false,
          OR: [tenantMemberFilter, tenantOwnerFilter],
        },
        select: {
          id: true,
        },
      });
      targetUserIds = targetUsers.map((u) => u.id);
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
      this._sseService.emitToUser(userId, {
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
