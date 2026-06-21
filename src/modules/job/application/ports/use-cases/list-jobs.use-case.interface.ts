import { Job } from '../../../domain/job.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListJobsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Job[]; total: number }>;
}
