import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEditJobUseCase } from '../ports/use-cases/edit-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { Job } from '../../domain/job.entity';
import { EditJobDto } from '../dto/edit-job.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Role } from '@/shared/enums/roles.enum';

@Injectable()
export class EditJobUseCase implements IEditJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    private readonly _prisma: PrismaService,
  ) {}

  async execute(id: string, dto: EditJobDto): Promise<Job> {
    const job = await this._jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
    }

    if (dto.assignedToUserId) {
      const assignee = await this._prisma.user.findFirst({
        where: {
          id: dto.assignedToUserId,
          tenantId: job.tenantId,
          role: { in: [Role.MACHINIST, Role.MAINTENANCE] },
          isDeleted: false,
        },
      });

      if (!assignee) {
        throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INVALID_ASSIGNEE);
      }
    }

    try {
      const { assignedToUserId, partId, ...rest } = dto;
      const updateData: Prisma.JobUpdateInput = { ...rest };

      if (partId) {
        updateData.part = { connect: { id: partId } };
      }

      if (assignedToUserId !== undefined) {
        if (assignedToUserId === null) {
          updateData.assignee = { disconnect: true };
        } else {
          updateData.assignee = { connect: { id: assignedToUserId } };
        }
      }

      return await this._jobRepository.update(id, updateData);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }
}
