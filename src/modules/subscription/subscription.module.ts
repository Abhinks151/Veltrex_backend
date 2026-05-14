import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { SubscriptionController } from './presentation/subscription.controller';
import { CreateSubscriptionUseCase } from './application/use-cases/create-subscription.use-case';
import { SubscriptionRepository } from './infrastructure/repositories/subscription-repository';
import { SubscriptionQueryService } from './subscription-query.service';
import { TenantModule } from '../tenant/tenant.module';
import { GetSubscriptionUseCase } from './application/use-cases/get-subscription.use-case';
import { ToggleStatusUseCase } from './application/use-cases/toggle-status.use-case';

@Module({
  imports: [AuthModule, forwardRef(() => TenantModule)],
  controllers: [SubscriptionController],
  providers: [
    {
      provide: 'ICreateSubscriptionUseCase',
      useClass: CreateSubscriptionUseCase,
    },
    {
      provide: 'IGetSubscriptionUseCase',
      useClass: GetSubscriptionUseCase,
    },
    {
      provide: 'IToggleStatusUseCase',
      useClass: ToggleStatusUseCase,
    },

    {
      provide: 'ISubscriptionRepository',
      useClass: SubscriptionRepository,
    },
    {
      provide: 'ISubscriptionQueryService',
      useClass: SubscriptionQueryService,
    },
  ],
  exports: ['ISubscriptionQueryService'],
})
export class SubscriptionModule {}
