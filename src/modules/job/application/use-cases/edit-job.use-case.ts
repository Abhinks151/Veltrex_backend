import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEditJobUseCase } from '../ports/use-cases/edit-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { ICheckRawMaterialAvailabilityUseCase } from '@/modules/raw-material/application/ports/use-cases/check-raw-material-availability.use-case.interface';
import { Job } from '../../domain/job.entity';
import { EditJobDto } from '../dto/edit-job.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EditJobUseCase implements IEditJobUseCase {
  constructor(
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    @Inject('ICheckRawMaterialAvailabilityUseCase')
    private readonly _checkRawMaterialAvailability: ICheckRawMaterialAvailabilityUseCase,
    private readonly _prisma: PrismaService,
  ) {}

  async execute(id: string, dto: EditJobDto): Promise<Job> {
    const job = await this._jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
    }

    // If the part or quantity is being changed, re-check raw material availability
    const effectivePartId = dto.partId ?? job.partId;
    const effectiveQuantity = dto.quantity ?? job.quantity;

    const part = await this._prisma.part.findFirst({
      where: { id: effectivePartId, isDeleted: false },
    });

    if (!part) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
    }

    if (part.rawMaterialId) {
      const hasEnoughStock = await this._checkRawMaterialAvailability.execute(
        part.rawMaterialId,
        effectiveQuantity,
      );

      if (!hasEnoughStock) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.INSUFFICIENT_RAW_MATERIAL,
        );
      }
    }

    try {
      const { partId, ...rest } = dto;
      const updateData: Prisma.JobUpdateInput = { ...rest };

      if (partId) {
        updateData.part = { connect: { id: partId } };
      }

      return await this._jobRepository.update(id, updateData);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }
}
