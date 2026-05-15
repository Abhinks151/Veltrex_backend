import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { AppLogger } from './logger.service';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest<Request>();
    // const { method, url, body, requestId } = req;

    /*
        const req = context.switchToHttp().getRequest<Request>();
        If we do not provide teh Request type, it will be any causing lint error

        express Request internally loosely uses body: any method:any
        so destrcuting will fail get it this way shown as in below
    */
    const method = req.method;
    const url = req.url;
    const body: unknown = req.body;
    const requestId = req.headers['x-request-id'];
    const start = Date.now();

    return next.handle().pipe(
      tap(() => {
        this.logger.log('HTTP Request handled', {
          requestId,
          method,
          url,
          body,
          duration: `${Date.now() - start}ms`,
        });
      }),
    );
  }
}
