import { Module } from '@nestjs/common';
import { SuperAdminController } from './presentation/super-admin.controller';
import { ListAllTenantsUseCase } from './application/use-cases/list-all-tenants.use-case';
import { ToggleTenantBlockUseCase } from './application/use-cases/toggle-tenant-block.use-case';
import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { ListAllAdminUsersUseCase } from './application/use-cases/list-all-users.use-case';
import { ToggleUserBlockUseCase } from './application/use-cases/toggle-user-block.use-case';

@Module({
  imports: [AuthModule, TenantModule],
  controllers: [SuperAdminController],
  providers: [
    {
      provide: 'IListAllTenantsUseCase',
      useClass: ListAllTenantsUseCase,
    },
    {
      provide: 'IToggleTenantBlockUseCase',
      useClass: ToggleTenantBlockUseCase,
    },
    {
      provide: 'IUpdateTenantUseCase',
      useClass: UpdateTenantUseCase,
    },
    {
      provide: 'IListAllAdminUsersUseCase',
      useClass: ListAllAdminUsersUseCase,
    },
    {
      provide: 'IToggleUserBlockUseCase',
      useClass: ToggleUserBlockUseCase,
    },
  ],
})
export class SuperAdminModule {}
