import { forwardRef, Module } from '@nestjs/common';
import { SuperAdminController } from './presentation/super-admin.controller';
import { ListAllTenantsUseCase } from './application/use-cases/list-all-tenants.use-case';
import { ToggleTenantBlockUseCase } from './application/use-cases/toggle-tenant-block.use-case';
import { AuthModule } from '../auth/auth.module';
import { TenantModule } from '../tenant/tenant.module';
import { UpdateTenantUseCase } from './application/use-cases/update-tenant.use-case';
import { ListAllAdminUsersUseCase } from './application/use-cases/list-all-users.use-case';
import { ToggleUserBlockUseCase } from './application/use-cases/toggle-user-block.use-case';
import { PlanRepository } from './infrastructure/repositories/plan-repository';
import { CreatePlanUseCase } from './application/use-cases/create-plan.use-case';
import { UpdatePlanUseCase } from './application/use-cases/update-plan.use-case';
import { TogglePlanBlockUseCase } from './application/use-cases/toggle-plan-block.use-case';
import { DeletePlanUseCase } from './application/use-cases/delete-plan.use-case';
import { ListAllPlansUseCase } from './application/use-cases/list-all-plans.use-case';
import { GetPlanByCodeUseCase } from './application/use-cases/get-plan-by-code.use-case';
import { GetPlanByIdUseCase } from './application/use-cases/get-plan-by-id.use-case';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => TenantModule)],
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
    {
      provide: 'IPlanRepository',
      useClass: PlanRepository,
    },
    {
      provide: 'ICreatePlanUseCase',
      useClass: CreatePlanUseCase,
    },
    {
      provide: 'IUpdatePlanUseCase',
      useClass: UpdatePlanUseCase,
    },
    {
      provide: 'ITogglePlanBlockUseCase',
      useClass: TogglePlanBlockUseCase,
    },
    {
      provide: 'IDeletePlanUseCase',
      useClass: DeletePlanUseCase,
    },
    {
      provide: 'IListAllPlansUseCase',
      useClass: ListAllPlansUseCase,
    },
    {
      provide: 'ISuperAdminGetPlanByCodeUseCase',
      useClass: GetPlanByCodeUseCase,
    },
    {
      provide: 'ISuperAdminGetPlanByIdUseCase',
      useClass: GetPlanByIdUseCase,
    },
  ],
  exports: ['ISuperAdminGetPlanByCodeUseCase', 'ISuperAdminGetPlanByIdUseCase'],
})
export class SuperAdminModule {}
