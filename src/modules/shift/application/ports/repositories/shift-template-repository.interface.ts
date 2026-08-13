import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { ShiftTemplate } from '../../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../../dto/create-shift-template.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

export interface IShiftTemplateRepository extends IBaseRepository<
  ShiftTemplate,
  CreateShiftTemplateDto,
  Prisma.ShiftTemplateUpdateInput
> {
  findByTenantAndId(
    tenantId: string,
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate | null>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: ShiftTemplate[]; total: number }>;
  findActiveTemplatesForDate(
    date: Date,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate[]>;
  findOverlapping(
    tenantId: string,
    employeeId: string,
    startDate: Date,
    endDate?: Date | null,
    excludeId?: string,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate | null>;
  updateTemplateJobs(
    id: string,
    jobs: Array<{ jobId: string; assignedQuantity: number; sequence: number }>,
    ctx?: ITransactionContext,
  ): Promise<void>;
}
