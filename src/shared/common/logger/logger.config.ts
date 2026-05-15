import * as winston from 'winston';
import 'winston-daily-rotate-file';

import { ConfigService } from '@nestjs/config';

export const createWinstonConfig = (configService: ConfigService) => {
  const isProd = configService.get<string>('NODE_ENV') === 'production';

  const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/app-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });

  const errorRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    level: 'error',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
  });

  return {
    level: isProd ? 'info' : 'debug',

    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({
        stack: true,
      }),
      winston.format.json(),
    ),

    transports: [
      new winston.transports.Console({
        format: isProd
          ? winston.format.json()
          : winston.format.combine(
              winston.format.colorize(),
              winston.format.simple(),
            ),
      }),

      fileRotateTransport,
      errorRotateTransport,
    ],
  };
};
