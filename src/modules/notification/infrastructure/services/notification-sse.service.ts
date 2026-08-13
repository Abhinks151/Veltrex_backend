import { BadRequestError } from '@/shared/common';
import { MESSAGE_CONSTANTS } from '@/shared/enums';
import { Injectable, MessageEvent } from '@nestjs/common';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IRealtimeNotificationService } from '../../application/ports/services/realtime-notification.service.interface';
import { NotificationPayload } from '../../application/dto/notification-payload.dto';

@Injectable()
export class NotificationSseService implements IRealtimeNotificationService {
  private clients = new Map<string, Subject<MessageEvent>[]>();

  registerClient(userId: string): Observable<MessageEvent> {
    const subject = new Subject<MessageEvent>();

    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    this.clients.get(userId)!.push(subject);

    return subject.asObservable().pipe(
      finalize(() => {
        const connections = this.clients.get(userId);
        if (connections) {
          const index = connections.indexOf(subject);
          if (index > -1) {
            connections.splice(index, 1);
          }
          if (connections.length === 0) {
            this.clients.delete(userId);
          }
        }
      }),
    );
  }

  emitToUser(userId: string, payload: NotificationPayload): void {
    const connections = this.clients.get(userId);
    if (connections && connections.length > 0) {
      const event: MessageEvent = {
        data: JSON.stringify(payload),
      };
      connections.forEach((subject) => {
        try {
          subject.next(event);
        } catch (err) {
          console.error(`Error emitting SSE event to user ${userId}:`, err);
          throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_SENT_SSE);
        }
      });
    }
  }
}
