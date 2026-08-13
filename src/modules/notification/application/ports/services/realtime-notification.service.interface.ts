import { Observable } from 'rxjs';
import { MessageEvent } from '@nestjs/common';
import { NotificationPayload } from '../../dto/notification-payload.dto';

export interface IRealtimeNotificationService {
  registerClient(userId: string): Observable<MessageEvent>;
  emitToUser(userId: string, payload: NotificationPayload): void;
}
