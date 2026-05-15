import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
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

import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Query } from '@nestjs/common';

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
  ) {}

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
}
