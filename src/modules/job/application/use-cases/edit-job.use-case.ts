import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { IEditJobUseCase } from '../ports/use-cases/edit-job.use-case.interface';
import { IJobRepository } from '../ports/repositories/job-repository.interface';
import { ICheckRawMaterialAvailabilityUseCase } from '@/modules/raw-material/application/ports/use-cases/check-raw-material-availability.use-case.interface';
import { IUpdateRawMaterialStockUseCase } from '@/modules/raw-material/application/ports/use-cases/update-raw-material-stock.use-case.interface';
import { IGetPartByIdUseCase } from '@/modules/part/application/ports/use-cases/get-part-by-id.use-case.interface';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';
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
    private readonly _jobRepository: IJobRepository,
    @Inject('ICheckRawMaterialAvailabilityUseCase')
    private readonly _checkRawMaterialAvailability: ICheckRawMaterialAvailabilityUseCase,
    @Inject('IUpdateRawMaterialStockUseCase')
    private readonly _updateRawMaterialStock: IUpdateRawMaterialStockUseCase,
    @Inject('IGetPartByIdUseCase')
    private readonly _getPartByIdUseCase: IGetPartByIdUseCase,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(id: string, dto: EditJobDto): Promise<Job> {
    const job = await this._jobRepository.findById(id);
    if (!job) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
    }

    if (
      job.status === JobStatus.IN_PROGRESS ||
      job.status === JobStatus.COMPLETED
    ) {
      if (dto.quantity !== undefined && dto.quantity !== job.quantity) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR
            .CANNOT_UPDATE_QUANTITY_WHEN_JOB_IS_IN_PROGRESS_OR_COMPLETED,
        );
      }
    }

    const oldPartId = job.partId;
    const newPartId = dto.partId ?? job.partId;
    const oldQuantity = job.quantity;
    const newQuantity = dto.quantity ?? job.quantity;

    const part = await this._getPartByIdUseCase.execute(newPartId);

    if (oldPartId !== newPartId) {
      try {
        const oldPart = await this._getPartByIdUseCase.execute(oldPartId);
        if (oldPart && oldPart.rawMaterialId) {
          await this._updateRawMaterialStock.execute(
            oldPart.rawMaterialId,
            oldQuantity,
          );
        }
      } catch {
        // check for old part, if not skip
      }

      if (part.rawMaterialId) {
        const hasEnoughStock = await this._checkRawMaterialAvailability.execute(
          part.rawMaterialId,
          newQuantity,
        );

        if (!hasEnoughStock) {
          throw new BadRequestError(
            MESSAGE_CONSTANTS.ERROR.INSUFFICIENT_RAW_MATERIAL,
          );
        }

        await this._updateRawMaterialStock.execute(
          part.rawMaterialId,
          -newQuantity,
        );
      }
    } else {
      const quantityDiff = newQuantity - oldQuantity;
      if (part.rawMaterialId && quantityDiff !== 0) {
        if (quantityDiff > 0) {
          const hasEnoughStock =
            await this._checkRawMaterialAvailability.execute(
              part.rawMaterialId,
              quantityDiff,
            );

          if (!hasEnoughStock) {
            throw new BadRequestError(
              MESSAGE_CONSTANTS.ERROR.INSUFFICIENT_RAW_MATERIAL,
            );
          }
        }

        await this._updateRawMaterialStock.execute(
          part.rawMaterialId,
          -quantityDiff,
        );
      }
    }

    let updatedJob: Job;
    try {
      const { partId, ...rest } = dto;
      const updateData: Prisma.JobUpdateInput = { ...rest };

      if (partId) {
        updateData.part = { connect: { id: partId } };
      }

      updatedJob = await this._jobRepository.update(id, updateData);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }

    if (
      dto.status === JobStatus.COMPLETED &&
      job.status !== JobStatus.COMPLETED
    ) {
      if (part.machineId) {
        const machine = await this._machineRepository.findById(part.machineId);
        if (machine && machine.status !== MachineStatus.MAINTENANCE) {
          await this._machineRepository.update(part.machineId, {
            status: MachineStatus.IDLE,
          });
        }
      }
    }

    if (
      dto.status === JobStatus.IN_PROGRESS &&
      job.status !== JobStatus.IN_PROGRESS &&
      part.machineId
    ) {
      await this._machineRepository.update(part.machineId, {
        status: MachineStatus.RUNNING,
      });
    }

    return updatedJob;
  }
}
