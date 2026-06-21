import { Inject, Injectable } from '@nestjs/common';
import { IDeleteJobUseCase } from '../ports/use-cases/delete-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { Job } from '../../domain/job.entity';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class DeleteJobUseCase implements IDeleteJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
  ) {}

  async execute(id: string): Promise<Job> {
    try {
      return await this._jobRepository.softDelete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }
}
