import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { TenantCreationRequestDto } from './dto/tenant-creation.request.dto';
import { ICreateTenantUseCase } from '../application/ports/use-cases/create-tenant.use-cases.interface';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { Role } from '@/shared/enums/roles.enum';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { Auth } from '@/modules/auth/presentation/decorators/auth.decorator';
import { IUpdateTenantUseCase } from '../application/ports/use-cases/update-tenant.use-case.interface';
import { IGetTenantUseCase } from '../application/ports/use-cases/get-tenant.use-case.interface';
import { IGetAllTenantUseCase } from '../application/ports/use-cases/get-all-tenant.use-case.interface';
import { ICheckTenantNameUseCase } from '../application/ports/use-cases/check-tenant-name.use-case.interface';
import { MESSAGE_CONSTANTS } from '../../../shared/enums/messageConstants';
import { Query } from '@nestjs/common';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { CurrentUser } from '@/shared/common/decorators/current-user.decorator';
import { AuthenticatedUser } from '@/modules/auth/application/types/authenticated-user.interface';

@Controller('tenant')
export class TenantController {
  constructor(
    @Inject('ITenantCreateUseCase')
    private readonly _createTenantUseCase: ICreateTenantUseCase,
    @Inject('ITenantUpdateUseCase')
    private readonly _updateTenantUseCase: IUpdateTenantUseCase,
    @Inject('ITenantGetUseCase')
    private readonly _getTenantUseCase: IGetTenantUseCase,
    @Inject('ITenantGetAllUseCase')
    private readonly _getAllTenantUseCase: IGetAllTenantUseCase,
    @Inject('ITenantCheckNameUseCase')
    private readonly _checkTenantNameUseCase: ICheckTenantNameUseCase,
  ) {}

  @Auth()
  @Get('check-name/:name')
  async checkName(@Param('name') name: string) {
    const isTaken = await this._checkTenantNameUseCase.execute(name);
    return new ApiResponse(true, { isTaken }, 'Availability checked');
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('get')
  async getTenant(@CurrentUser() user: AuthenticatedUser) {
    if (!user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const reposnse = await this._getTenantUseCase.execute(user.userId);
    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.TENANT_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Get('get-all')
  async getAllTenants(@Query() query: PaginationQueryDto) {
    // if (!req.user) {
    //   throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND)
    // }

    const result = await this._getAllTenantUseCase.execute(query);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.TENANT_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Post('create')
  async createNewTenant(
    @Req() req: Request,
    @Body() reqDto: TenantCreationRequestDto,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const reposnse = await this._createTenantUseCase.execute(
      {
        name: reqDto.name,
        plan: reqDto.plan,
        ownerId: req.user.userId,
      },
      req.user.userId,
    );
    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.TENANT_CREATED,
    );
  }

  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  @UseGuards(RolesGuard)
  @Auth()
  @Patch('update/:id')
  async updateTenant(
    @Req() req: Request,
    @Body() reqDto: TenantCreationRequestDto,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!req.user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const reposnse = await this._updateTenantUseCase.execute(
      {
        name: reqDto.name,
        ownerId: req.user.userId,
      },
      id,
    );

    return new ApiResponse(
      true,
      reposnse,
      MESSAGE_CONSTANTS.SUCCESS.TENANT_UPDATED,
    );
  }
}
