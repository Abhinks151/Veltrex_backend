import { Inject, Injectable } from '@nestjs/common';
import { ICreateJobUseCase } from '../ports/use-cases/create-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { IGetPartByIdUseCase } from '@/modules/part/application/ports/use-cases/get-part-by-id.use-case.interface';
import { Job } from '../../domain/job.entity';
import { CreateJobDto } from '../dto/create-job.dto';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreateJobUseCase implements ICreateJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    @Inject('IGetPartByIdUseCase')
    private readonly _getPartByIdUseCase: IGetPartByIdUseCase,
  ) {}

  async execute(dto: CreateJobDto): Promise<Job> {
    const part = await this._getPartByIdUseCase.execute(dto.partId);

    if (part.tenantId !== dto.tenantId) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
    }

    try {
      return await this._jobRepository.create(dto);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_JOB);
    }
  }
}
