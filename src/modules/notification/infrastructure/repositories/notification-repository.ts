import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import { INotificationRepository } from '../../application/ports/repositories/notification-repository.interface';
import { Notification } from '../../domain/notification.entity';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../../application/dto/create-notification.dto';
import {
  RawNotification,
  toNotificationMapper,
} from '../../application/mapper/notification.mapper';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { Prisma } from '@prisma/client';

@Injectable()
export class NotificationRepository
  extends BaseRepository<
    Notification,
    CreateNotificationDto,
    UpdateNotificationDto,
    RawNotification
  >
  implements INotificationRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.NOTIFICATION, toNotificationMapper);
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const list = await this._prisma.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return list.map(toNotificationMapper);
  }

  async findById(id: string): Promise<Notification | null> {
    const response = await this._prisma.notification.findUnique({
      where: { id },
    });
    return response ? toNotificationMapper(response as RawNotification) : null;
  }

  async markAllRead(userId: string): Promise<void> {
    await this._prisma.notification.updateMany({
      where: {
        userId,
        readAt: null,
      },
      data: {
        readAt: new Date(),
      },
    });
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    try {
      const response = await this._prisma.notification.update({
        where: {
          id,
          userId,
        },
        data: {
          readAt: new Date(),
        },
      });
      return toNotificationMapper(response as RawNotification);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.NOTIFICATION_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_NOTIFICATION,
      );
    }
  }
}
