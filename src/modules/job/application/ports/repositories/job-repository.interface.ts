import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Prisma } from '@prisma/client';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { Job } from '@/modules/job/domain/job.entity';
import { CreateJobDto } from '../../dto/create-job.dto';

export interface IJobRepository extends IBaseRepository<
  Job,
  CreateJobDto,
  Prisma.JobUpdateInput
> {
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Job[]; total: number }>;
  findByTenantAndId(
    tenantId: string,
    id: string,
    ctx?: ITransactionContext,
  ): Promise<Job | null>;
  softDelete(id: string): Promise<Job>;
  countActiveByPartId(partId: string): Promise<number>;
}
