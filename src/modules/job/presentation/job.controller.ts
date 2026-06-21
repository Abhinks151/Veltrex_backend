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
import { CreateJobRequest } from './dto/create-job.request.dto';
import { EditJobRequest } from './dto/edit-job.request.dto';
import { ICreateJobUseCase } from '../application/ports/use-cases/create-job.use-case.interface';
import { IEditJobUseCase } from '../application/ports/use-cases/edit-job.use-case.interface';
import { IListJobsUseCase } from '../application/ports/use-cases/list-jobs.use-case.interface';
import { IDeleteJobUseCase } from '../application/ports/use-cases/delete-job.use-case.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Controller('job')
export class JobController {
  constructor(
    @Inject('ICreateJobUseCase')
    private readonly _createJobUseCase: ICreateJobUseCase,
    @Inject('IEditJobUseCase')
    private readonly _editJobUseCase: IEditJobUseCase,
    @Inject('IListJobsUseCase')
    private readonly _listJobsUseCase: IListJobsUseCase,
    @Inject('IDeleteJobUseCase')
    private readonly _deleteJobUseCase: IDeleteJobUseCase,
  ) {}

  @Roles(Role.ADMIN, Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('create')
  async create(@Req() req: Request, @Body() dto: CreateJobRequest) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createJobUseCase.execute({
      ...dto,
      tenantId: req.user.tenantId,
      createdByUserId: req.user.userId,
      repeat: dto.repeat ?? false,
    });

    return new ApiResponse(true, result, MESSAGE_CONSTANTS.SUCCESS.JOB_CREATED);
  }

  @Roles(Role.ADMIN, Role.MAINTENANCE, Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('edit/:id')
  async edit(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: EditJobRequest,
  ) {
    const result = await this._editJobUseCase.execute(id, dto);
    return new ApiResponse(true, result, MESSAGE_CONSTANTS.SUCCESS.JOB_UPDATED);
  }

  @Roles(Role.ADMIN, Role.MAINTENANCE, Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('list')
  async list(@Req() req: Request, @Query() query: PaginationQueryDto) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listJobsUseCase.execute(
      req.user.tenantId,
      query,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.JOBS_FETCHED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Delete('delete/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    const result = await this._deleteJobUseCase.execute(id);
    return new ApiResponse(true, result, MESSAGE_CONSTANTS.SUCCESS.JOB_DELETED);
  }
}
