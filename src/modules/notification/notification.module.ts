import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { NotificationController } from './presentation/notification.controller';
import { NotificationRepository } from './infrastructure/repositories/notification-repository';
import { NotificationSseService } from './infrastructure/services/notification-sse.service';
import { PrismaNotificationUserQueryService } from './infrastructure/services/prisma-notification-user-query.service';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { GetMyNotificationsUseCase } from './application/use-cases/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-cases/mark-all-notifications-as-read.use-case';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [NotificationController],
  providers: [
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
    },
    {
      provide: 'IRealtimeNotificationService',
      useClass: NotificationSseService,
    },
    {
      provide: 'INotificationUserQueryService',
      useClass: PrismaNotificationUserQueryService,
    },

    {
      provide: 'ICreateNotificationUseCase',
      useClass: CreateNotificationUseCase,
    },
    {
      provide: 'IGetMyNotificationsUseCase',
      useClass: GetMyNotificationsUseCase,
    },
    {
      provide: 'IMarkNotificationAsReadUseCase',
      useClass: MarkNotificationAsReadUseCase,
    },
    {
      provide: 'IMarkAllNotificationsAsReadUseCase',
      useClass: MarkAllNotificationsAsReadUseCase,
    },
  ],
  exports: ['ICreateNotificationUseCase', 'IRealtimeNotificationService'],
})
export class NotificationModule {}
