import { forwardRef, Module } from '@nestjs/common';
import { TenantController } from './presentation/tenant.controller';
import { CreateTenantUseCase } from './application/use-cases/create-tenant.use-case';
import { TenantRepository } from './infrastructure/repositories/tenant-repository';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { AuthModule } from '../auth/auth.module';
import { GetTenantUseCase } from './application/use-cases/get-tenant.use-case';
import { GetAllTenantUseCase } from './application/use-cases/get-all-tenant.use-case';
import { SubscriptionModule } from '../subscription/subscription.module';
import { CheckTenantNameUseCase } from './application/use-cases/check-tenant-name.use-case';
import { SuperAdminModule } from '../super-admin/super-admin.module';
import { CheckValidTenantUseCase } from './application/use-cases/check-valid-tenant.use-case';
import { ToggleTenantBlockUseCase } from './application/use-cases/toggle-tenant-block.use-case';
import { GetTenantByIdUseCase } from './application/use-cases/get-tenant-by-id.use-case';
import { GetTenantByOwnerIdUseCase } from './application/use-cases/get-tenant-by-owner-id.use-case';
import { CheckTenantBlockedUseCase } from './application/use-cases/check-tenant-blocked.use-case';
import { MarkTrialAsUsedUseCase } from './application/use-cases/mark-trial-as-used.use-case';
import { GetTenantBySubdomainUseCase } from './application/use-cases/get-tenant-by-subdomain.use-case';
import { CheckTenantSubdomainUseCase } from './application/use-cases/check-tenant-subdomain.use-case';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => SubscriptionModule),
    forwardRef(() => SuperAdminModule),
  ],
  controllers: [TenantController],
  providers: [
    {
      provide: 'ITenantCreateUseCase',
      useClass: CreateTenantUseCase,
    },
    {
      provide: 'ITenantRepository',
      useClass: TenantRepository,
    },
    {
      provide: 'ITenantUpdateUseCase',
      useClass: UpdateTenantUseCase,
    },
    {
      provide: 'ITenantGetUseCase',
      useClass: GetTenantUseCase,
    },
    {
      provide: 'ITenantGetAllUseCase',
      useClass: GetAllTenantUseCase,
    },
    {
      provide: 'ITenantCheckNameUseCase',
      useClass: CheckTenantNameUseCase,
    },
    {
      provide: 'ITenantCheckValidUseCase',
      useClass: CheckValidTenantUseCase,
    },
    {
      provide: 'ITenantToggleBlockUseCase',
      useClass: ToggleTenantBlockUseCase,
    },
    {
      provide: 'ITenantGetByIdUseCase',
      useClass: GetTenantByIdUseCase,
    },
    {
      provide: 'ITenantGetByOwnerIdUseCase',
      useClass: GetTenantByOwnerIdUseCase,
    },
    {
      provide: 'ITenantCheckBlockedUseCase',
      useClass: CheckTenantBlockedUseCase,
    },
    {
      provide: 'ITenantMarkTrialAsUsedUseCase',
      useClass: MarkTrialAsUsedUseCase,
    },
    {
      provide: 'ITenantGetBySubdomainUseCase',
      useClass: GetTenantBySubdomainUseCase,
    },
    {
      provide: 'ITenantCheckSubdomainUseCase',
      useClass: CheckTenantSubdomainUseCase,
    },
  ],

  exports: [
    'ITenantCreateUseCase',
    'ITenantRepository',
    'ITenantGetUseCase',
    'ITenantGetAllUseCase',
    'ITenantUpdateUseCase',
    'ITenantCheckNameUseCase',
    'ITenantCheckValidUseCase',
    'ITenantToggleBlockUseCase',
    'ITenantGetByIdUseCase',
    'ITenantGetByOwnerIdUseCase',
    'ITenantCheckBlockedUseCase',
    'ITenantMarkTrialAsUsedUseCase',
    'ITenantGetBySubdomainUseCase',
    'ITenantCheckSubdomainUseCase',
  ],
})
export class TenantModule {}
