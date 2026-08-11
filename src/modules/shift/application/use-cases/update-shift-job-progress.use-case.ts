import { Inject, Injectable } from '@nestjs/common';
import {
  IUpdateShiftJobProgressUseCase,
  UpdateShiftJobProgressDto,
} from '../ports/use-cases/update-shift-job-progress.use-case.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';
import { ShiftJob, ShiftStatus } from '../../domain/shift.entity';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';
import { IPartRepository } from '@/modules/part/application/ports/repositories/part-repository.interface';
import { ICheckRawMaterialAvailabilityUseCase } from '@/modules/raw-material/application/ports/use-cases/check-raw-material-availability.use-case.interface';
import { IUpdateRawMaterialStockUseCase } from '@/modules/raw-material/application/ports/use-cases/update-raw-material-stock.use-case.interface';

@Injectable()
export class UpdateShiftJobProgressUseCase implements IUpdateShiftJobProgressUseCase {
  constructor(
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('ICheckRawMaterialAvailabilityUseCase')
    private readonly _checkRawMaterialAvailability: ICheckRawMaterialAvailabilityUseCase,
    @Inject('IUpdateRawMaterialStockUseCase')
    private readonly _updateRawMaterialStock: IUpdateRawMaterialStockUseCase,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    dto: UpdateShiftJobProgressDto,
  ): Promise<ShiftJob> {
    return this._txManager.run(async (ctx: ITransactionContext) => {
      const shiftJob = await this._productionShiftRepository.findShiftJobById(
        id,
        ctx,
      );
      if (!shiftJob || shiftJob.tenantId !== tenantId) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.SHIFT_JOB_NOT_FOUND);
      }

      const completed = dto.completedQuantity;
      if (completed < 0) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.COMPLETED_QUANTITY_CANNOT_BE_NEGATIVE,
        );
      }

      const addedQuantity = completed - shiftJob.completedQuantity;

      const parentShift =
        await this._productionShiftRepository.findByTenantAndId(
          tenantId,
          shiftJob.productionShiftId,
          ctx,
        );

      if (!parentShift) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.SHIFT_NOT_FOUND);
      }

      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const shiftDate = new Date(parentShift.date);
      shiftDate.setUTCHours(0, 0, 0, 0);

      if (shiftDate < today) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.CANNOT_UPDATE_PROGRESS_FOR_PAST_SHIFTS,
        );
      }

      // Stock updates
      if (addedQuantity > 0) {
        const partId = shiftJob.job?.partId;
        if (partId) {
          const part = await this._partRepository.findById(partId);
          if (part && part.rawMaterialId) {
            const hasEnoughStock =
              await this._checkRawMaterialAvailability.execute(
                part.rawMaterialId,
                addedQuantity,
              );

            if (!hasEnoughStock) {
              throw new BadRequestError(
                MESSAGE_CONSTANTS.ERROR.INSUFFICIENT_RAW_MATERIAL,
              );
            }

            // Deduct from stock
            await this._updateRawMaterialStock.execute(
              part.rawMaterialId,
              -addedQuantity,
            );
          }
        }
      } else if (addedQuantity < 0) {
        // If they correct it downwards, we restore stock
        const partId = shiftJob.job?.partId;
        if (partId) {
          const part = await this._partRepository.findById(partId);
          if (part && part.rawMaterialId) {
            await this._updateRawMaterialStock.execute(
              part.rawMaterialId,
              Math.abs(addedQuantity),
            );
          }
        }
      }

      // it will throw an lint errorso declare it first with type
      let jobStatus: ShiftStatus = ShiftStatus.PENDING;
      if (completed > 0) {
        if (completed >= shiftJob.assignedQuantity) {
          jobStatus = ShiftStatus.COMPLETED;
        } else {
          jobStatus = ShiftStatus.IN_PROGRESS;
        }
      }

      const updatedJob = await this._productionShiftRepository.updateShiftJob(
        id,
        {
          completedQuantity: completed,
          status: jobStatus,
        },
        ctx,
      );

      // Machine status update, for both running and idle(after completion)
      if (
        updatedJob.status === ShiftStatus.IN_PROGRESS ||
        updatedJob.status === ShiftStatus.COMPLETED
      ) {
        const partId = updatedJob.job?.partId;

        if (partId) {
          const part = await this._partRepository.findById(partId);

          if (!part) {
            throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
          }

          if (!part.machineId) {
            throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
          }

          const machine = await this._machineRepository.findById(
            part.machineId,
          );

          if (!machine) {
            throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
          }

          const newStatus =
            updatedJob.status === ShiftStatus.IN_PROGRESS
              ? MachineStatus.RUNNING
              : MachineStatus.IDLE;

          const expectedCurrentStatus =
            updatedJob.status === ShiftStatus.IN_PROGRESS
              ? MachineStatus.IDLE
              : MachineStatus.RUNNING;

          if (machine.status === expectedCurrentStatus) {
            await this._machineRepository.update(part.machineId, {
              status: newStatus,
            });
          }
        }
      }

      if (parentShift && parentShift.shiftJobs) {
        const statuses = parentShift.shiftJobs.map((j) => {
          if (j.id === id) return jobStatus;
          return j.status;
        });

        let newShiftStatus = ShiftStatus.PENDING;
        if (statuses.every((s) => s === ShiftStatus.COMPLETED)) {
          newShiftStatus = ShiftStatus.COMPLETED;
        } else if (
          statuses.some(
            (s) => s === ShiftStatus.IN_PROGRESS || s === ShiftStatus.COMPLETED,
          )
        ) {
          newShiftStatus = ShiftStatus.IN_PROGRESS;
        }

        await this._productionShiftRepository.update(
          parentShift.id,
          { status: newShiftStatus },
          ctx,
        );
      }

      return updatedJob;
    });
  }
}
