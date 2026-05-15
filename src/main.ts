import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppLogger } from './shared/common/logger/logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = app.get(AppLogger);
  app.useLogger(logger);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL')?.replace(/\/$/, ''),

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
