import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '@/shared/infrastructure/prisma/prisma.module';
import { NotificationController } from './presentation/notification.controller';
import { NotificationRepository } from './infrastructure/repositories/notification-repository';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.use-case';
import { GetMyNotificationsUseCase } from './application/use-cases/get-my-notifications.use-case';
import { MarkNotificationAsReadUseCase } from './application/use-cases/mark-notification-as-read.use-case';
import { MarkAllNotificationsAsReadUseCase } from './application/use-cases/mark-all-notifications-as-read.use-case';
import { NotificationSseService } from './infrastructure/services/notification-sse.service';

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [NotificationController],
  providers: [
    NotificationSseService,
    {
      provide: 'INotificationRepository',
      useClass: NotificationRepository,
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
  exports: ['ICreateNotificationUseCase', NotificationSseService],
})
export class NotificationModule {}
