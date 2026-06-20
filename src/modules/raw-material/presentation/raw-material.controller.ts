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
import { CreateRawMaterialRequest } from './dto/create-raw-material.request.dto';
import { EditRawMaterialRequest } from './dto/edit-raw-material.request.dto';
import { ICreateRawMaterialUseCase } from '../application/ports/use-cases/create-raw-material.use-case.interface';
import { IEditRawMaterialUseCase } from '../application/ports/use-cases/edit-raw-material.use-case.interface';
import { IGetAllActiveRawMaterialsUseCase } from '../application/ports/use-cases/get-all-active-raw-materials.use-case.interface';
import { IListRawMaterialsUseCase } from '../application/ports/use-cases/list-raw-materials.use-case.interface';
import { IBlockRawMaterialUseCase } from '../application/ports/use-cases/block-raw-material.use-case.interface';
import { IDeleteRawMaterialUseCase } from '../application/ports/use-cases/delete-raw-material.use-case.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Controller('raw-material')
export class RawMaterialController {
  constructor(
    @Inject('ICreateRawMaterialUseCase')
    private readonly _createRawMaterialUseCase: ICreateRawMaterialUseCase,
    @Inject('IEditRawMaterialUseCase')
    private readonly _editRawMaterialUseCase: IEditRawMaterialUseCase,
    @Inject('IGetAllActiveRawMaterialsUseCase')
    private readonly _getAllActiveRawMaterialsUseCase: IGetAllActiveRawMaterialsUseCase,
    @Inject('IListRawMaterialsUseCase')
    private readonly _listRawMaterialsUseCase: IListRawMaterialsUseCase,
    @Inject('IBlockRawMaterialUseCase')
    private readonly _blockRawMaterialUseCase: IBlockRawMaterialUseCase,
    @Inject('IDeleteRawMaterialUseCase')
    private readonly _deleteRawMaterialUseCase: IDeleteRawMaterialUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateRawMaterialRequest) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createRawMaterialUseCase.execute({
      ...dto,
      tenantId: req.user.tenantId,
    });

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_CREATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: EditRawMaterialRequest,
  ) {
    const result = await this._editRawMaterialUseCase.execute(id, dto);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_UPDATED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('active')
  async getActive(@Req() req: Request) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._getAllActiveRawMaterialsUseCase.execute(
      req.user.tenantId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIALS_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('list')
  async list(@Req() req: Request, @Query() query: PaginationQueryDto) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listRawMaterialsUseCase.execute(
      req.user.tenantId,
      query,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIALS_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('block/:id')
  async toggleBlock(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._blockRawMaterialUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_BLOCK_TOGGLED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._deleteRawMaterialUseCase.execute(id);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.RAW_MATERIAL_DELETED,
    );
  }
}
