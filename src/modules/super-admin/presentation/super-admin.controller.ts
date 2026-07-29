import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { IListAllTenantsUseCase } from '../application/ports/use-cases/list-all-tenants.use-case.interface';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { IToggleTenantBlockUseCase } from '../application/ports/use-cases/toggle-tenant-block.use-case.interface';
import { IUpdateTenantUseCase } from '../application/ports/use-cases/update-tenant.use-case.interface';
import { IListAllAdminUsersUseCase } from '../application/ports/use-cases/list-all-users.use-case.interface';
import { IToggleUserBlockUseCase } from '../application/ports/use-cases/toggle-user-block.use-case.interface';
import { UpdateTenantNameRequestDto } from './dto/update-name.request.dto';
import { MESSAGE_CONSTANTS } from '../../../shared/enums/messageConstants';
import { ICreatePlanUseCase } from '../application/ports/use-cases/create-plan.use-case.interface';
import { IUpdatePlanUseCase } from '../application/ports/use-cases/update-plan.use-case.interface';
import { ITogglePlanBlockUseCase } from '../application/ports/use-cases/toggle-plan-block.use-case.interface';
import { IDeletePlanUseCase } from '../application/ports/use-cases/delete-plan.use-case.interface';
import { IListAllPlansUseCase } from '../application/ports/use-cases/list-all-plans.use-case.interface';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { GetDashboardQueryDto } from './dto/get-dashboard-query.dto';
import { IGetSuperAdminDashboardStatsUseCase } from '../application/ports/use-cases/get-super-admin-dashboard-stats.use-case.interface';

import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Controller('super-admin')
export class SuperAdminController {
  constructor(
    @Inject('IListAllTenantsUseCase')
    private readonly _listAllTenantsUseCase: IListAllTenantsUseCase,
    @Inject('IToggleTenantBlockUseCase')
    private readonly _toggleTenantBlockUseCase: IToggleTenantBlockUseCase,
    @Inject('IUpdateTenantUseCase')
    private readonly _updateTenantUseCase: IUpdateTenantUseCase,
    @Inject('IListAllAdminUsersUseCase')
    private readonly _listAllAdminUsersUseCase: IListAllAdminUsersUseCase,
    @Inject('IToggleUserBlockUseCase')
    private readonly _toggleUserBlockUseCase: IToggleUserBlockUseCase,
    @Inject('ICreatePlanUseCase')
    private readonly _createPlanUseCase: ICreatePlanUseCase,
    @Inject('IUpdatePlanUseCase')
    private readonly _updatePlanUseCase: IUpdatePlanUseCase,
    @Inject('ITogglePlanBlockUseCase')
    private readonly _togglePlanBlockUseCase: ITogglePlanBlockUseCase,
    @Inject('IDeletePlanUseCase')
    private readonly _deletePlanUseCase: IDeletePlanUseCase,
    @Inject('IListAllPlansUseCase')
    private readonly _listAllPlansUseCase: IListAllPlansUseCase,
    @Inject('IGetSuperAdminDashboardStatsUseCase')
    private readonly _getDashboardStatsUseCase: IGetSuperAdminDashboardStatsUseCase,
  ) {}

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('dashboard')
  async getDashboardStats(@Query() query: GetDashboardQueryDto) {
    const stats = await this._getDashboardStatsUseCase.execute(query);
    return new ApiResponse(
      true,
      stats,
      MESSAGE_CONSTANTS.SUCCESS.DASHBOARD_STATS_FETCHED,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('tenants')
  async listAllTenants(@Query() query: PaginationQueryDto) {
    const { tenants, total } = await this._listAllTenantsUseCase.execute(query);
    return new ApiResponse(
      true,
      { tenants, total },
      MESSAGE_CONSTANTS.SUCCESS.ALL_TENANTS_FETCHED,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('users')
  async listAllAdminUsers(@Query() query: PaginationQueryDto) {
    const { users, total } =
      await this._listAllAdminUsersUseCase.execute(query);
    return new ApiResponse(
      true,
      { users, total },
      MESSAGE_CONSTANTS.SUCCESS.ALL_USERS_FETCHED,
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('users/:id/toggle-block')
  async toggleUserBlock(@Param('id') id: string) {
    const user = await this._toggleUserBlockUseCase.execute(id);
    const status = user.isBlocked ? 'blocked' : 'unblocked';

    return new ApiResponse(true, user, `User ${status} successfully`);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('tenants/:id/toggle-block')
  async toggleTenantBlock(@Param('id') id: string) {
    const tenant = await this._toggleTenantBlockUseCase.execute(id);
    const hai = tenant.isBlocked ? 'blocked' : 'unblocked';

    return new ApiResponse(true, tenant, `Tenant ${hai} successfully`);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('tenants/:id/update-name')
  async updateTenantName(
    @Param('id') id: string,
    @Body() body: UpdateTenantNameRequestDto,
  ) {
    // console.log(body.name, "name", id, "id");
    const tenant = await this._updateTenantUseCase.execute(id, body.name);
    return new ApiResponse(
      true,
      tenant,
      MESSAGE_CONSTANTS.SUCCESS.TENANT_NAME_UPDATED,
    );
  }

  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('plans')
  async listAllPlans(@Query() query: PaginationQueryDto) {
    const { plans, total } = await this._listAllPlansUseCase.execute(query);
    return new ApiResponse(
      true,
      { plans, total },
      'Plans fetched successfully',
    );
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Post('plans')
  async createPlan(@Body() body: CreatePlanDto) {
    const plan = await this._createPlanUseCase.execute(body);
    return new ApiResponse(true, plan, 'Plan created successfully');
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('plans/:id')
  async updatePlan(@Param('id') id: string, @Body() body: UpdatePlanDto) {
    const plan = await this._updatePlanUseCase.execute(id, body);
    return new ApiResponse(true, plan, 'Plan updated successfully');
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('plans/:id/toggle-block')
  async togglePlanBlock(@Param('id') id: string) {
    const plan = await this._togglePlanBlockUseCase.execute(id);
    const status = plan.isBlocked ? 'blocked' : 'unblocked';
    return new ApiResponse(true, plan, `Plan ${status} successfully`);
  }

  @Roles(Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Delete('plans/:id')
  async deletePlan(@Param('id') id: string) {
    await this._deletePlanUseCase.execute(id);
    return new ApiResponse(true, null, 'Plan deleted successfully');
  }
}
