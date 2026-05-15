import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppLogger } from './shared/common/logger/logger.service';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { requestId, method, originalUrl } = req;
    this.logger.log(`Incoming ${method} request on ${originalUrl}`, {
      requestId,
    });
    next();
  }
}

//sample commit
//sample commit
