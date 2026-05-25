import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Role } from '@/shared/enums/roles.enum';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { IsVerifiedGuard } from '@/modules/auth/presentation/guards/is-verified.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { SubscriptionGuard } from '@/modules/subscription/presentation/guards/subscription.guard';
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { CreateMachineRequest } from './dto/create-machine.request.dto';
import { EditMachineRequest } from './dto/edit-machine.request.dto';
import { ICreateMachineUseCase } from '../application/ports/use-cases/create-machine.use-case.interface';
import { IEditMachineUseCase } from '../application/ports/use-cases/edit-machine.use-case.interface';
import { IGetAllActiveMachinesUseCase } from '../application/ports/use-cases/get-all-active-machines.use-case.interface';
import { IListMachinesUseCase } from '../application/ports/use-cases/list-machines.use-case.interface';
import { IBlockMachineUseCase } from '../application/ports/use-cases/block-machine.use-case.interface';
import { IDeleteMachineUseCase } from '../application/ports/use-cases/delete-machine.use-case.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Controller('machine')
export class MachineController {
  constructor(
    @Inject('ICreateMachineUseCase')
    private readonly _createMachineUseCase: ICreateMachineUseCase,
    @Inject('IEditMachineUseCase')
    private readonly _editMachineUseCase: IEditMachineUseCase,
    @Inject('IGetAllActiveMachinesUseCase')
    private readonly _getAllActiveMachinesUseCase: IGetAllActiveMachinesUseCase,
    @Inject('IListMachinesUseCase')
    private readonly _listMachinesUseCase: IListMachinesUseCase,
    @Inject('IBlockMachineUseCase')
    private readonly _blockMachineUseCase: IBlockMachineUseCase,
    @Inject('IDeleteMachineUseCase')
    private readonly _deleteMachineUseCase: IDeleteMachineUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateMachineRequest) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createMachineUseCase.execute({
      ...dto,
      tenantId: req.user.tenantId,
    });

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINE_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: EditMachineRequest,
  ) {
    const result = await this._editMachineUseCase.execute(id, dto);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINE_UPDATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('active')
  async getActive(@Req() req: Request) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._getAllActiveMachinesUseCase.execute(
      req.user.tenantId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINES_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('list')
  async list(@Req() req: Request, @Query() query: PaginationQueryDto) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listMachinesUseCase.execute(
      req.user.tenantId,
      query,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINES_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('block/:id')
  async toggleBlock(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._blockMachineUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINE_BLOCK_TOGGLED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._deleteMachineUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINE_DELETED,
    );
  }
}
