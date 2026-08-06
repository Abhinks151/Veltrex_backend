import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { MaintenanceTicket } from '../../../domain/maintenance-ticket.entity';
import { CreateMaintenanceTicketDto } from '../../dto/create-maintenance-ticket.dto';
import { UpdateMaintenanceTicketDto } from '../../dto/update-maintenance-ticket.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { MaintenanceStatus } from '../../../domain/maintenance-status.enum';

export interface IMaintenanceTicketRepository extends IBaseRepository<
  MaintenanceTicket,
  CreateMaintenanceTicketDto,
  UpdateMaintenanceTicketDto
> {
  findByIdAndTenant(
    id: string,
    tenantId: string,
    ctx?: ITransactionContext,
  ): Promise<MaintenanceTicket | null>;
  findActiveByMachine(
    machineId: string,
    ctx?: ITransactionContext,
  ): Promise<MaintenanceTicket | null>;
  findOpenByTenant(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
  findInProgressByAssignee(
    tenantId: string,
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
  findByCreator(
    tenantId: string,
    creatorId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
  findAllByTenant(
    tenantId: string,
    query: PaginationQueryDto & {
      machineId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
  countActiveByMachine(
    machineId: string,
    ctx?: ITransactionContext,
  ): Promise<number>;
  tryAssign(
    id: string,
    userId: string,
    ctx?: ITransactionContext,
  ): Promise<number>;
  tryRelease(
    id: string,
    userId: string,
    ctx?: ITransactionContext,
  ): Promise<number>;
  tryClose(
    id: string,
    userId: string,
    data: {
      status: MaintenanceStatus;
      resolvedBy: string;
      resolvedAt: Date;
      isActive: boolean;
      reason: string;
      actualDurationMinutes?: number;
    },
    ctx?: ITransactionContext,
  ): Promise<number>;
  findMachineIdsForMachinist(
    tenantId: string,
    machinistId: string,
  ): Promise<string[]>;
}
