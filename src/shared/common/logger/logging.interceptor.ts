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

  private sanitize(data: unknown): unknown {
    if (!data || typeof data !== 'object') {
      return data;
    }

    const sensitiveKeys = [
      'password',
      'token',
      'refreshToken',
      'secret',
      'clientSecret',
      'signature',
    ];

    if (Array.isArray(data)) {
      return data.map((item) => this.sanitize(item));
    }

    const obj = data as Record<string, unknown>;
    const cloned: Record<string, unknown> = {};

    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (
        sensitiveKeys.some((sk) => key.toLowerCase().includes(sk.toLowerCase()))
      ) {
        cloned[key] = '[REDACTED]';
      } else if (val && typeof val === 'object') {
        cloned[key] = this.sanitize(val);
      } else {
        cloned[key] = val;
      }
    }
    return cloned;
  }

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
    const body: unknown = this.sanitize(req.body);
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
