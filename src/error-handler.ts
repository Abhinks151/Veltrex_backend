import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { AppLogger } from './shared/common/logger/logger.service';
import {
  ApplicationError,
  NotFoundError,
  ConflictError,
  UnauthorizedError,
  ForbiddenError,
  BadRequestError,
} from './shared/common/errors/domain-errors';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const responseMessage = exceptionResponse.message;

        message =
          typeof responseMessage === 'string' || Array.isArray(responseMessage)
            ? responseMessage
            : exception.message;
      } else {
        message = exception.message;
      }
    } else if (exception instanceof ApplicationError) {
      if (exception instanceof NotFoundError) {
        status = HttpStatus.NOT_FOUND;
      } else if (exception instanceof ConflictError) {
        status = HttpStatus.CONFLICT;
      } else if (exception instanceof UnauthorizedError) {
        status = HttpStatus.UNAUTHORIZED;
      } else if (exception instanceof ForbiddenError) {
        status = HttpStatus.FORBIDDEN;
      } else if (exception instanceof BadRequestError) {
        status = HttpStatus.BAD_REQUEST;
      }
      message = exception.message;
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorLog = `${status} [${request.method}] ${request.url} - ${
      Array.isArray(message) ? message.join(', ') : message
    }`;

    if (status >= 500) {
      const stack = exception instanceof Error ? exception.stack : undefined;

      this.logger.error(errorLog, stack);
    } else {
      this.logger.warn(errorLog);
    }

    response.status(status).json({
      success: false,
      message: Array.isArray(message) ? message.join(', ') : message,
    });
  }
}
