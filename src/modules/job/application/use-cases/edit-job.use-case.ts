import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEditJobUseCase } from '../ports/use-cases/edit-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { Job, JobStatus } from '../../domain/job.entity';
import { EditJobDto } from '../dto/edit-job.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class EditJobUseCase implements IEditJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly jobRepository: IJobRepository,
  ) {}

  async execute(id: string, dto: EditJobDto): Promise<Job> {
    const job = await this.getJob(id);

    this.validateUpdate(job, dto);

    const updateData = this.buildUpdateData(dto);

    try {
      return await this.jobRepository.update(id, updateData);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }

  private async getJob(id: string): Promise<Job> {
    const job = await this.jobRepository.findById(id);

    if (!job) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
    }

    return job;
  }

  private validateUpdate(job: Job, dto: EditJobDto): void {
    if (dto.quantity === undefined) {
      return;
    }

    if (dto.quantity === job.quantity) {
      return;
    }

    const lockedStatus =
      job.status === JobStatus.IN_PROGRESS ||
      job.status === JobStatus.COMPLETED;

    if (lockedStatus) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR
          .CANNOT_UPDATE_QUANTITY_WHEN_JOB_IS_IN_PROGRESS_OR_COMPLETED,
      );
    }
  }

  private buildUpdateData(dto: EditJobDto): Prisma.JobUpdateInput {
    const { partId, ...data } = dto;

    return {
      ...data,
      ...(partId && {
        part: {
          connect: {
            id: partId,
          },
        },
      }),
    };
  }
}
