import { Injectable, LoggerService } from '@nestjs/common';
import * as winston from 'winston';
import { winstonConfig } from './logger.config';

@Injectable()
export class AppLogger implements LoggerService {
  private readonly logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger(winstonConfig);
  }

  log(message: string, ...optionalParams: unknown[]) {
    this.logger.info(message, ...optionalParams);
  }

  error(message: string, ...optionalParams: unknown[]) {
    this.logger.error(message, ...optionalParams);
  }

  warn(message: string, ...optionalParams: unknown[]) {
    this.logger.warn(message, ...optionalParams);
  }

  debug(message: string, ...optionalParams: unknown[]) {
    this.logger.debug(message, ...optionalParams);
  }

  verbose(message: string, ...optionalParams: unknown[]) {
    this.logger.verbose(message, ...optionalParams);
  }

  info(message: string, ...optionalParams: unknown[]) {
    this.logger.info(message, ...optionalParams);
  }
}
