import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppLogger } from './shared/common/logger/logger.service';
import { MESSAGE_CONSTANTS } from './shared/enums/messageConstants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  const allowedOrigins = [
    configService.get<string>('FRONTEND_URL')?.replace(/\/$/, ''),
    configService.get<string>('PRODUCTION_URL')?.replace(/\/$/, ''),
  ].filter(Boolean);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin) return callback(null, true);

      try {
        const originHost = new URL(origin).hostname;
        const baseDomain =
          configService.get<string>('BASE_DOMAIN') || 'localhost';

        const isAllowed = allowedOrigins.some((ao) => origin === ao);
        const isBaseDomain = originHost === baseDomain;
        const isSubdomain = originHost.endsWith(`.${baseDomain}`);
        const isLocalhost =
          originHost === 'localhost' || originHost === '127.0.0.1';

        if (isAllowed || isBaseDomain || isSubdomain || isLocalhost) {
          callback(null, true);
        } else {
          callback(new Error(MESSAGE_CONSTANTS.ERROR.NOT_ALLOWED_BY_CORS));
        }
      } catch {
        callback(new Error(MESSAGE_CONSTANTS.ERROR.INVALID_ORIGIN));
      }
    },

    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(configService.get<number>('PORT') ?? 3000);
}

void bootstrap();
