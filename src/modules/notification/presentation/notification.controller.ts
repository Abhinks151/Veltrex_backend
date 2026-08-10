import {
  Controller,
  Get,
  Patch,
  Param,
  Sse,
  UseGuards,
  Req,
  UnauthorizedException,
  ParseUUIDPipe,
  Inject,
  MessageEvent,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { IsVerifiedGuard } from '@/modules/auth/presentation/guards/is-verified.guard';
import { NotificationSseService } from '../infrastructure/services/notification-sse.service';
import { IGetMyNotificationsUseCase } from '../application/ports/use-cases/get-my-notifications.use-case.interface';
import { IMarkNotificationAsReadUseCase } from '../application/ports/use-cases/mark-notification-as-read.use-case.interface';
import { IMarkAllNotificationsAsReadUseCase } from '../application/ports/use-cases/mark-all-notifications-as-read.use-case.interface';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly _sseService: NotificationSseService,
    @Inject('IGetMyNotificationsUseCase')
    private readonly _getMyNotificationsUseCase: IGetMyNotificationsUseCase,
    @Inject('IMarkNotificationAsReadUseCase')
    private readonly _markNotificationAsReadUseCase: IMarkNotificationAsReadUseCase,
    @Inject('IMarkAllNotificationsAsReadUseCase')
    private readonly _markAllNotificationsAsReadUseCase: IMarkAllNotificationsAsReadUseCase,
  ) {}

  @UseGuards(JwtAuthGuard, IsVerifiedGuard)
  @Sse('sse')
  sse(@Req() req: Request): Observable<MessageEvent> {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException();
    }
    return this._sseService.registerClient(req.user.userId);
  }

  @UseGuards(JwtAuthGuard, IsVerifiedGuard)
  @Get('list')
  async getMyNotifications(@Req() req: Request) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException();
    }
    const result = await this._getMyNotificationsUseCase.execute(
      req.user.userId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.NOTIFICATIONS_FETCHED,
    );
  }

  @UseGuards(JwtAuthGuard, IsVerifiedGuard)
  @Patch('read/:id')
  async markAsRead(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException();
    }
    const result = await this._markNotificationAsReadUseCase.execute(
      id,
      req.user.userId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.NOTIFICATION_READ,
    );
  }

  @UseGuards(JwtAuthGuard, IsVerifiedGuard)
  @Patch('read-all')
  async markAllAsRead(@Req() req: Request) {
    if (!req.user || !req.user.userId) {
      throw new UnauthorizedException();
    }
    await this._markAllNotificationsAsReadUseCase.execute(req.user.userId);
    return new ApiResponse(
      true,
      null,
      MESSAGE_CONSTANTS.SUCCESS.ALL_NOTIFICATIONS_READ,
    );
  }
}
