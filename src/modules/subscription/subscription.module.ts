import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionController } from './presentation/subscription.controller';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import { SubscriptionRepository } from './infrastructure/repositories/subscription-repository';

import { TenantModule } from '../tenant/tenant.module';
import { GetSubscriptionUseCase } from './application/use-cases/get-subscription.use-case';
import { ToggleStatusUseCase } from './application/use-cases/toggle-status.use-case';
import { SubscriptionGuard } from './presentation/guards/subscription.guard';
import { GetSubscriptionByTenantIdUseCase } from './application/use-cases/get-subscription-by-tenant-id.use-case';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => TenantModule)],
  controllers: [SubscriptionController],
  providers: [
    SubscriptionGuard,
    {
      provide: 'ISubscriptionCreateUseCase',
      useClass: CreateSubscriptionUseCase,
    },
    {
      provide: 'ISubscriptionGetUseCase',
      useClass: GetSubscriptionUseCase,
    },
    {
      provide: 'ISubscriptionToggleStatusUseCase',
      useClass: ToggleStatusUseCase,
    },
    {
      provide: 'ISubscriptionGetByTenantIdUseCase',
      useClass: GetSubscriptionByTenantIdUseCase,
    },

    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
  ],
  exports: [
    'ISubscriptionCreateUseCase',
    'ISubscriptionGetUseCase',
    'ISubscriptionToggleStatusUseCase',
    'ISubscriptionGetByTenantIdUseCase',
    SubscriptionGuard,
  ],
})
export class SubscriptionModule {}
