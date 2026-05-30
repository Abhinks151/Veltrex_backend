import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { RequestLoggerMiddleware } from './app.middleware';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggingInterceptor } from './shared/common/logger/logging.interceptor';
import { RequestIdMiddleware } from './shared/common/logger/log-request-id.middleware';
import { LoggerModule } from './shared/common/logger/logger.module';
import { HttpExceptionFilter } from './error-handler';
import { AuthModule } from './modules/auth/auth.module';
import { TenantModule } from './modules/tenant/tenant.module';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { PrismaModule } from './shared/infrastructure/prisma/prisma.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MachineModule } from './modules/machine/machine.module';
import { FixtureModule } from './modules/fixture/fixture.module';
import { PaymentModule } from './modules/payment/payment.module';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './shared/common/logger/logger.config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    LoggerModule,
    TenantModule,
    SuperAdminModule,
    SubscriptionModule,
    ProfileModule,
    MachineModule,
    FixtureModule,
    PaymentModule,

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: Number(process.env.RATE_LIMIT_TTL) ?? 60000,
        limit: Number(process.env.RATE_LIMIT) ?? 10,
      },
    ]),

    //config package
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    //multer for s3
    MulterModule.register({
      storage: memoryStorage(),
    }),

    // Logger
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createWinstonConfig(configService),
    }),
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestIdMiddleware, RequestLoggerMiddleware).forRoutes('*');
  }
}
