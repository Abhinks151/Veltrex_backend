import {
  Body,
  Controller,
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
import { ApiResponse } from '@/shared/common/apiResponse/api-response';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { Role } from '@/shared/enums/roles.enum';
import { Roles } from '@/modules/auth/presentation/decorators/roles.decorator';
import { JwtAuthGuard } from '@/modules/auth/presentation/guards/jwt-auth.guard';
import { IsVerifiedGuard } from '@/modules/auth/presentation/guards/is-verified.guard';
import { RolesGuard } from '@/modules/auth/presentation/guards/roles.guard';
import { SubscriptionGuard } from '@/modules/subscription/presentation/guards/subscription.guard';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { CreateMaintenanceTicketRequest } from './dto/create-maintenance-ticket.request.dto';
import { CloseMaintenanceTicketRequest } from './dto/close-maintenance-ticket.request.dto';
import { ICreateMaintenanceTicketUseCase } from '../application/ports/use-cases/create-maintenance-ticket.use-case.interface';
import { IAssignMaintenanceTicketUseCase } from '../application/ports/use-cases/assign-maintenance-ticket.use-case.interface';
import { IReleaseMaintenanceTicketUseCase } from '../application/ports/use-cases/release-maintenance-ticket.use-case.interface';
import { ICloseMaintenanceTicketUseCase } from '../application/ports/use-cases/close-maintenance-ticket.use-case.interface';
import { IListOpenTicketsUseCase } from '../application/ports/use-cases/list-open-tickets.use-case.interface';
import { IListMyTicketsUseCase } from '../application/ports/use-cases/list-my-tickets.use-case.interface';
import { IListAllTicketsUseCase } from '../application/ports/use-cases/list-all-tickets.use-case.interface';
import { IListMachinistTicketsUseCase } from '../application/ports/use-cases/list-machinist-tickets.use-case.interface';
import { IGetMachinistMachinesUseCase } from '../application/ports/use-cases/get-machinist-machines.use-case.interface';

@Controller('maintenance')
export class MaintenanceController {
  constructor(
    @Inject('ICreateMaintenanceTicketUseCase')
    private readonly _createUseCase: ICreateMaintenanceTicketUseCase,
    @Inject('IAssignMaintenanceTicketUseCase')
    private readonly _assignUseCase: IAssignMaintenanceTicketUseCase,
    @Inject('IReleaseMaintenanceTicketUseCase')
    private readonly _releaseUseCase: IReleaseMaintenanceTicketUseCase,
    @Inject('ICloseMaintenanceTicketUseCase')
    private readonly _closeUseCase: ICloseMaintenanceTicketUseCase,
    @Inject('IListOpenTicketsUseCase')
    private readonly _listOpenUseCase: IListOpenTicketsUseCase,
    @Inject('IListMyTicketsUseCase')
    private readonly _listMyUseCase: IListMyTicketsUseCase,
    @Inject('IListAllTicketsUseCase')
    private readonly _listAllUseCase: IListAllTicketsUseCase,
    @Inject('IListMachinistTicketsUseCase')
    private readonly _listMachinistUseCase: IListMachinistTicketsUseCase,
    @Inject('IGetMachinistMachinesUseCase')
    private readonly _getMachinesUseCase: IGetMachinistMachinesUseCase,
  ) {}

  @Roles(Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Post('create')
  async create(
    @Req() req: Request,
    @Body() dto: CreateMaintenanceTicketRequest,
  ) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._createUseCase.execute({
      ...dto,
      tenantId: req.user.tenantId,
      createdBy: req.user.userId,
    });

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.TICKET_CREATED,
    );
  }

  @Roles(Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('machinist/machines')
  async getMachinistMachines(@Req() req: Request) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._getMachinesUseCase.execute(
      req.user.tenantId,
      req.user.userId,
    );

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MACHINES_FETCHED,
    );
  }

  @Roles(Role.MACHINIST)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('machinist/tickets')
  async getMachinistTickets(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listMachinistUseCase.execute(
      req.user.tenantId,
      req.user.userId,
      query,
    );

    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MY_TICKETS_FETCHED,
    );
  }

  @Roles(Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('tickets/open')
  async getOpenTickets(
    @Req() req: Request,
    @Query() query: PaginationQueryDto,
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listOpenUseCase.execute(
      req.user.tenantId,
      query,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.OPEN_TICKETS_FETCHED,
    );
  }

  @Roles(Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('tickets/mine')
  async getMyTickets(@Req() req: Request, @Query() query: PaginationQueryDto) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listMyUseCase.execute(
      req.user.tenantId,
      req.user.userId,
      query,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.MY_TICKETS_FETCHED,
    );
  }

  @Roles(Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('tickets/:id/assign')
  async assignTicket(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._assignUseCase.execute(
      id,
      req.user.tenantId,
      req.user.userId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.TICKET_ASSIGNED,
    );
  }

  @Roles(Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('tickets/:id/release')
  async releaseTicket(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
  ) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._releaseUseCase.execute(
      id,
      req.user.tenantId,
      req.user.userId,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.TICKET_RELEASED,
    );
  }

  @Roles(Role.MAINTENANCE)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Patch('tickets/:id/close')
  async closeTicket(
    @Req() req: Request,
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CloseMaintenanceTicketRequest,
  ) {
    if (!req.user || !req.user.tenantId || !req.user.userId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._closeUseCase.execute(
      id,
      req.user.tenantId,
      req.user.userId,
      dto,
    );
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.TICKET_CLOSED,
    );
  }

  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, IsVerifiedGuard, RolesGuard, SubscriptionGuard)
  @Get('admin/logs')
  async getAdminsLogs(
    @Req() req: Request,
    @Query()
    query: PaginationQueryDto & {
      machineId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    if (!req.user || !req.user.tenantId) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const result = await this._listAllUseCase.execute(req.user.tenantId, query);
    return new ApiResponse(
      true,
      result,
      MESSAGE_CONSTANTS.SUCCESS.ALL_TICKETS_FETCHED,
    );
  }
}
