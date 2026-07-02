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
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

import { ICreateShiftTemplateUseCase } from '../application/ports/use-cases/create-shift-template.use-case.interface';
import { IEditShiftTemplateUseCase } from '../application/ports/use-cases/edit-shift-template.use-case.interface';
import { IDeleteShiftTemplateUseCase } from '../application/ports/use-cases/delete-shift-template.use-case.interface';
import { IListShiftTemplatesUseCase } from '../application/ports/use-cases/list-shift-templates.use-case.interface';
import { IGenerateProductionShiftUseCase } from '../application/ports/use-cases/generate-production-shift.use-case.interface';
import { IListProductionShiftsUseCase } from '../application/ports/use-cases/list-production-shifts.use-case.interface';
import { IUpdateShiftJobProgressUseCase } from '../application/ports/use-cases/update-shift-job-progress.use-case.interface';

import { CreateShiftTemplateRequest } from './dto/create-shift-template.request.dto';
import { EditShiftTemplateRequest } from './dto/edit-shift-template.request.dto';
import { UpdateShiftJobProgressRequest } from './dto/update-shift-job-progress.request.dto';

@Controller('shift')
export class ShiftController {
  constructor(
    @Inject('ICreateShiftTemplateUseCase')
    private readonly _createShiftTemplateUseCase: ICreateShiftTemplateUseCase,
    @Inject('IEditShiftTemplateUseCase')
    private readonly _editShiftTemplateUseCase: IEditShiftTemplateUseCase,
    @Inject('IDeleteShiftTemplateUseCase')
    private readonly _deleteShiftTemplateUseCase: IDeleteShiftTemplateUseCase,
    @Inject('IListShiftTemplatesUseCase')
    private readonly _listShiftTemplatesUseCase: IListShiftTemplatesUseCase,
    @Inject('IGenerateProductionShiftUseCase')
    private readonly _generateProductionShiftUseCase: IGenerateProductionShiftUseCase,
    @Inject('IListProductionShiftsUseCase')
    private readonly _listProductionShiftsUseCase: IListProductionShiftsUseCase,
    @Inject('IUpdateShiftJobProgressUseCase')
    private readonly _updateShiftJobProgressUseCase: IUpdateShiftJobProgressUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('template/create')
  async createTemplate(
    @Req() req: Request,
    @Body() dto: CreateShiftTemplateRequest,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createShiftTemplateUseCase.execute({
      ...dto,
      startDate: new Date(dto.startDate),
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      tenantId: req.user.tenantId,
      createdByUserId: req.user.userId,
    });

    return new ApiResponse(true, result, 'Shift template created successfully');
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('template/edit/:id')
  async editTemplate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @Body() dto: EditShiftTemplateRequest,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._editShiftTemplateUseCase.execute(
      id,
      req.user.tenantId,
      {
        ...dto,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      },
    );

    return new ApiResponse(true, result, 'Shift template updated successfully');
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Delete('template/delete/:id')
  async deleteTemplate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._deleteShiftTemplateUseCase.execute(
      id,
      req.user.tenantId,
    );

    return new ApiResponse(true, result, 'Shift template deleted successfully');
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('template/list')
  async listTemplates(@Req() req: Request, @Query() query: PaginationQueryDto) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listShiftTemplatesUseCase.execute(
      req.user.tenantId,
      query,
    );

    return new ApiResponse(
      true,
      result,
      'Shift templates fetched successfully',
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('production/generate/:templateId')
  async generateProductionShift(
    @Param('templateId', new ParseUUIDPipe()) templateId: string,
    @Req() req: Request,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const today = new Date();
    const result = await this._generateProductionShiftUseCase.execute(
      templateId,
      req.user.tenantId,
      today,
      req.user.userId,
    );

    return new ApiResponse(
      true,
      result,
      'Production shift generated successfully',
    );
  }

  @Roles(Role.ADMIN, Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('production/list')
  async listProductionShifts(
    @Req() req: Request,
    @Query() query: PaginationQueryDto & { date?: string; employeeId?: string },
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const employeeFilterId =
      req.user.role === Role.MACHINIST ? req.user.userId : query.employeeId;

    const result = await this._listProductionShiftsUseCase.execute(
      req.user.tenantId,
      {
        ...query,
        employeeId: employeeFilterId,
        onlyFutureOrToday: req.user.role === Role.MACHINIST,
      },
    );

    return new ApiResponse(
      true,
      result,
      'Production shifts fetched successfully',
    );
  }

  @Roles(Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('production/job-progress/:id')
  async updateJobProgress(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: Request,
    @Body() dto: UpdateShiftJobProgressRequest,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._updateShiftJobProgressUseCase.execute(
      id,
      req.user.tenantId,
      dto,
    );

    return new ApiResponse(
      true,
      result,
      'Shift job progress updated successfully',
    );
  }
}
