import { Inject, Injectable } from '@nestjs/common';
import { ICreateJobUseCase } from '../ports/use-cases/create-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { Job } from '../../domain/job.entity';
import { CreateJobDto } from '../dto/create-job.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Role } from '@/shared/enums/roles.enum';

@Injectable()
export class CreateJobUseCase implements ICreateJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    private readonly _prisma: PrismaService,
  ) {}

  async execute(dto: CreateJobDto): Promise<Job> {
    const part = await this._prisma.part.findFirst({
      where: {
        id: dto.partId,
        tenantId: dto.tenantId,
        isDeleted: false,
      },
    });

    if (!part) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
    }

    if (dto.assignedToUserId) {
      const assignee = await this._prisma.user.findFirst({
        where: {
          id: dto.assignedToUserId,
          tenantId: dto.tenantId,
          role: { in: [Role.MACHINIST, Role.MAINTENANCE] },
          isDeleted: false,
        },
      });

      if (!assignee) {
        throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INVALID_ASSIGNEE);
      }
    }

    try {
      return await this._jobRepository.create(dto);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_JOB);
    }
  }
}
