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
import { UserRole } from '@prisma/client';
import { Auth } from './decorators/auth.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '@/shared/enums/roles.enum';
import { SubscriptionGuard } from '@/modules/subscription/presentation/guards/subscription.guard';
import { TenantValidationGuard } from '@/modules/tenant/presentation/guards/tenant-validation.guard';

import { CurrentUser } from '@/shared/common/decorators/current-user.decorator';
import { ValidatedUserDto } from '../application/dto/jwt-strategy.dto';
import { CreateEmployeeRequestDto } from './dto/create-employee.request.dto';
import { UpdateEmployeeRequestDto } from './dto/update-employee.request.dto';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';
import { ICreateEmployeeUseCase } from '../application/ports/use-cases/create-employee.use-case.interface';
import { IListEmployeesUseCase } from '../application/ports/use-cases/list-employees.use-case.interface';
import { IUpdateEmployeeUseCase } from '../application/ports/use-cases/update-employee.use-case.interface';
import { IToggleEmployeeBlockUseCase } from '../application/ports/use-cases/toggle-employee-block.use-case.interface';
import { ISoftDeleteEmployeeUseCase } from '../application/ports/use-cases/delete-employee.use-case.interface';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { IBulkCreateEmployeeUseCase } from '../application/ports/use-cases/bulk-create-employee.use-case.interface';
import { BulkCreateEmployeeRequestDto } from './dto/bulk-create-employee.request.dto';

@UseGuards(RolesGuard, SubscriptionGuard, TenantValidationGuard)
@Auth()
@Controller('platform/employees')
export class EmployeeController {
  constructor(
    @Inject('ICreateEmployeeUseCase')
    private readonly _createEmployeeUseCase: ICreateEmployeeUseCase,
    @Inject('IListEmployeesUseCase')
    private readonly _listEmployeesUseCase: IListEmployeesUseCase,
    @Inject('IUpdateEmployeeUseCase')
    private readonly _updateEmployeeUseCase: IUpdateEmployeeUseCase,
    @Inject('IToggleEmployeeBlockUseCase')
    private readonly _toggleEmployeeBlockUseCase: IToggleEmployeeBlockUseCase,
    @Inject('ISoftDeleteEmployeeUseCase')
    private readonly _softDeleteEmployeeUseCase: ISoftDeleteEmployeeUseCase,
    @Inject('IBulkCreateEmployeeUseCase')
    private readonly _bulkCreateEmployeeUseCase: IBulkCreateEmployeeUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async create(
    @CurrentUser() user: ValidatedUserDto,
    @Body() reqDto: CreateEmployeeRequestDto,
  ) {
    const data = await this._createEmployeeUseCase.execute({
      ...reqDto,
      role: reqDto.role as UserRole,
      tenantId: user.tenantId as string,
    });
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_CREATED);
  }

  @Roles(Role.ADMIN)
  @Post('bulk')
  async bulkCreate(
    @CurrentUser() user: ValidatedUserDto,
    @Body() reqDto: BulkCreateEmployeeRequestDto,
  ) {
    const data = await this._bulkCreateEmployeeUseCase.execute({
      employees: reqDto.employees.map((emp) => ({
        ...emp,
        role: emp.role as UserRole,
        tenantId: user.tenantId as string,
      })),
    });
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_CREATED);
  }

  @Roles(Role.ADMIN)
  @Get()
  async list(
    @CurrentUser() user: ValidatedUserDto,
    @Query() query: ListEmployeesQueryDto,
  ) {
    const data = await this._listEmployeesUseCase.execute(
      user.tenantId as string,
      query,
    );
    return new ApiResponse(
      true,
      data,
      MESSAGE_CONSTANTS.SUCCESS.ALL_USERS_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() reqDto: UpdateEmployeeRequestDto,
  ) {
    const data = await this._updateEmployeeUseCase.execute(id, reqDto);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_UPDATED);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/toggle-block')
  async toggleBlock(@Param('id') id: string) {
    const data = await this._toggleEmployeeBlockUseCase.execute(id);
    const status = data.isBlocked ? 'blocked' : 'unblocked';
    return new ApiResponse(true, data, `Employee ${status} successfully`);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this._softDeleteEmployeeUseCase.execute(id);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_DELETED);
  }
}
