import { Inject, Injectable } from '@nestjs/common';
import { IListJobsUseCase } from '../ports/use-cases/list-jobs.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { Job } from '../../domain/job.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListJobsUseCase implements IListJobsUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Job[]; total: number }> {
    return this._jobRepository.findAllPaginated(tenantId, query);
  }
}
