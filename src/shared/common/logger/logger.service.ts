import { Injectable, LoggerService, Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class AppLogger implements LoggerService {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  log(message: string, ...optionalParams: unknown[]) {
    this.logger.info(message, optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]) {
    this.logger.error(message, optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.logger.warn(message, optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]) {
    this.logger.debug(message, optionalParams);
  }

  verbose(message: string, ...optionalParams: unknown[]) {
    this.logger.verbose(message, optionalParams);
  }
}
