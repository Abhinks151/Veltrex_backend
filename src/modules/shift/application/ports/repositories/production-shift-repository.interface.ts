import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { ProductionShift, ShiftJob } from '../../../domain/shift.entity';
import { CreateProductionShiftDto } from '../../dto/create-production-shift.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { MachinistDashboardStatsDto } from '../use-cases/get-machinist-dashboard.use-case.interface';
import { AdminDashboardStatsDto } from '../use-cases/get-admin-dashboard.use-case.interface';

export interface IProductionShiftRepository extends IBaseRepository<
  ProductionShift,
  CreateProductionShiftDto,
  Prisma.ProductionShiftUpdateInput
> {
  findByTenantAndId(
    tenantId: string,
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ProductionShift | null>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto & {
      date?: string;
      employeeId?: string;
      onlyFutureOrToday?: boolean;
    },
  ): Promise<{ items: ProductionShift[]; total: number }>;
  existsForTemplateAndDate(
    templateId: string,
    date: Date,
    ctx?: ITransactionContext,
  ): Promise<boolean>;
  findShiftJobById(
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ShiftJob | null>;
  updateShiftJob(
    id: string,
    data: Prisma.ShiftJobUpdateInput,
    ctx?: ITransactionContext,
  ): Promise<ShiftJob>;
  createShiftJobs(
    shiftId: string,
    tenantId: string,
    jobs: Array<{ jobId: string; assignedQuantity: number; sequence: number }>,
    ctx?: ITransactionContext,
  ): Promise<void>;
  getMachinistDashboardStats(
    tenantId: string,
    employeeId: string,
    today: Date,
  ): Promise<MachinistDashboardStatsDto>;
  getAdminDashboardStats(tenantId: string): Promise<AdminDashboardStatsDto>;
}
