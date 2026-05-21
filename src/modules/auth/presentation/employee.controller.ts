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
import { Auth } from './decorators/auth.decorator';
import { Roles } from './decorators/roles.decorator';
import { RolesGuard } from './guards/roles.guard';
import { Role } from '@/shared/enums/roles.enum';
import { CurrentUser } from '@/shared/common/decorators/current-user.decorator';
import { ValidatedUserDto } from '../application/dto/jwt-strategy.dto';
import { CreateEmployeeRequestDto } from './dto/create-employee.request.dto';
import { UpdateEmployeeRequestDto } from './dto/update-employee.request.dto';
import { ListEmployeesQueryDto } from './dto/list-employees-query.dto';
import { ICreateEmployeeUseCase } from '../application/ports/use-cases/create-employee.use-case.interface';
import { IListEmployeesUseCase } from '../application/ports/use-cases/list-employees.use-case.interface';
import { IUpdateEmployeeUseCase } from '../application/ports/use-cases/update-employee.use-case.interface';
import { IToggleEmployeeBlockUseCase } from '../application/ports/use-cases/toggle-employee-block.use-case.interface';
import { ISoftDeleteEmployeeUseCase } from '../application/ports/use-cases/soft-delete-employee.use-case.interface';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

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
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Auth()
  @Post()
  async create(
    @CurrentUser() user: ValidatedUserDto,
    @Body() reqDto: CreateEmployeeRequestDto,
  ) {
    const data = await this._createEmployeeUseCase.execute({
      ...reqDto,
      tenantId: user.tenantId as string,
    });
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_CREATED);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Auth()
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

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Auth()
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() reqDto: UpdateEmployeeRequestDto,
  ) {
    const data = await this._updateEmployeeUseCase.execute(id, reqDto);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_UPDATED);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Auth()
  @Patch(':id/toggle-block')
  async toggleBlock(@Param('id') id: string) {
    const data = await this._toggleEmployeeBlockUseCase.execute(id);
    const status = data.isBlocked ? 'blocked' : 'unblocked';
    return new ApiResponse(true, data, `Employee ${status} successfully`);
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Auth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    const data = await this._softDeleteEmployeeUseCase.execute(id);
    return new ApiResponse(true, data, MESSAGE_CONSTANTS.SUCCESS.USER_DELETED);
  }
}
