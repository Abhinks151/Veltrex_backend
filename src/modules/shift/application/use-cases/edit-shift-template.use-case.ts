import { Inject, Injectable } from '@nestjs/common';
import { IEditShiftTemplateUseCase } from '../ports/use-cases/edit-shift-template.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { ShiftTemplate } from '../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../dto/create-shift-template.dto';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { Prisma } from '@prisma/client';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { SHIFT_NOTIFICATION } from '../constants/shift-notification.constants';
import { IUserRepository } from '../../../auth/application/ports/repositories/user-repository.interface';
import { IJobRepository } from '../../../job/application/ports/repositories/job-repository.interface';
import { JobStatus } from '@/modules/job/domain/job.entity';

@Injectable()
export class EditShiftTemplateUseCase implements IEditShiftTemplateUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    dto: Partial<CreateShiftTemplateDto>,
  ): Promise<ShiftTemplate> {
    return this._txManager.run(async (ctx: ITransactionContext) => {
      // Check if template exists
      const existing = await this._shiftTemplateRepository.findByTenantAndId(
        tenantId,
        id,
        ctx,
      );
      if (!existing) {
        throw new NotFoundError(
          MESSAGE_CONSTANTS.ERROR.SHIFT_TEMPLATE_NOT_FOUND,
        );
      }

      if (dto.employeeId || dto.startDate || dto.endDate !== undefined) {
        const targetEmployeeId = dto.employeeId ?? existing.employeeId;
        const targetStartDate = dto.startDate ?? existing.startDate;
        const targetEndDate =
          dto.endDate !== undefined ? dto.endDate : existing.endDate;

        const overlapping = await this._shiftTemplateRepository.findOverlapping(
          tenantId,
          targetEmployeeId,
          targetStartDate,
          targetEndDate,
          id,
          ctx,
        );

        if (overlapping) {
          throw new BadRequestError(
            MESSAGE_CONSTANTS.ERROR.SHIFT_TEMPLATE_ALREADY_EXISTS,
          );
        }
      }

      if (dto.jobs) {
        for (const jobDto of dto.jobs) {
          const job = await this._jobRepository.findByTenantAndId(
            tenantId,
            jobDto.jobId,
            ctx,
          );
          if (!job) {
            throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
          }
          if (
            job.status === JobStatus.COMPLETED ||
            job.status === JobStatus.CANCELLED
          ) {
            throw new BadRequestError(
              MESSAGE_CONSTANTS.ERROR.JOB_IS_COMPLETED_OR_CANCELLED,
            );
          }
          if (jobDto.assignedQuantity <= 0) {
            throw new BadRequestError(
              MESSAGE_CONSTANTS.ERROR.ASSIGNED_QUANTITY_MUST_BE_GREATER_THAN_0,
            );
          }
        }

        await this._shiftTemplateRepository.updateTemplateJobs(
          id,
          dto.jobs,
          ctx,
        );
      }

      const updateData: Prisma.ShiftTemplateUpdateInput = {};
      if (dto.employeeId) {
        const employee = await this._userRepository.findById(
          dto.employeeId,
          ctx,
        );
        if (!employee || employee.tenantId !== tenantId) {
          throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.EMPLOYEE_NOT_FOUND);
        }
        if (employee.isBlocked) {
          throw new BadRequestError(
            MESSAGE_CONSTANTS.ERROR.EMPLOYEE_IS_BLOCKED,
          );
        }
        updateData.employee = { connect: { id: dto.employeeId } };
      }
      if (dto.shiftType) {
        updateData.shiftType = dto.shiftType;
      }
      if (dto.repeatType) {
        updateData.repeatType = dto.repeatType;
      }
      if (dto.startDate) {
        updateData.startDate = dto.startDate;
      }
      if (dto.endDate !== undefined) {
        updateData.endDate = dto.endDate || null;
      }

      await this._shiftTemplateRepository.update(id, updateData, ctx);

      const updatedTemplate =
        await this._shiftTemplateRepository.findByTenantAndId(
          tenantId,
          id,
          ctx,
        );

      await this._createNotificationUseCase.execute({
        tenantId: dto.tenantId,
        userId: dto.employeeId,
        type: NotificationType.SHIFT_EDITED,
        title: SHIFT_NOTIFICATION.EDITED.title,
        message: SHIFT_NOTIFICATION.EDITED.message,
      });

      return updatedTemplate!;
    });
  }
}
