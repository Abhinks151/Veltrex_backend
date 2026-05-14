import { forwardRef, Module } from '@nestjs/common';
import { TenantController } from './presentation/tenant.controller';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { TenantRepository } from './infrastructure/repositories/tenant-repository';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { AuthModule } from '../auth/auth.module';
import { TenantQueryService } from './tenant-query.service';
import { GetTenantUseCase } from './application/use-cases/get-tenant.use-case';
import { GetAllTenantUseCase } from './application/use-cases/get-all-tenant.use-case';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CheckTenantNameUseCase } from './application/use-cases/check-tenant-name.use-case';

@Module({
  imports: [AuthModule, forwardRef(() => SubscriptionModule)],
  controllers: [TenantController],
  providers: [
    TenantQueryService,
    {
      provide: 'ICreateTenantUseCase',
      useClass: CreateTenantUseCase,
    },
    {
      provide: 'ITenantRepository',
      useClass: TenantRepository,
    },
    {
      provide: 'IUpdateTenantUseCase',
      useClass: UpdateTenantUseCase,
    },
    {
      provide: 'ITenantQueryService',
      useClass: TenantQueryService,
    },
    {
      provide: 'IGetTenantUseCase',
      useClass: GetTenantUseCase,
    },
    {
      provide: 'IGetAllTenantUseCase',
      useClass: GetAllTenantUseCase,
    },
    {
      provide: 'ICheckTenantNameUseCase',
      useClass: CheckTenantNameUseCase,
    },
  ],
  exports: [TenantQueryService, 'ITenantQueryService'],
})
export class TenantModule {}
