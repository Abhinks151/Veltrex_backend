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

@Injectable()
export class UpdateShiftJobProgressUseCase implements IUpdateShiftJobProgressUseCase {
  constructor(
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
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
