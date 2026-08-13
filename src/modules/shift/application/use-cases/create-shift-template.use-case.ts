import { Inject, Injectable } from '@nestjs/common';
import { ICreateShiftTemplateUseCase } from '../ports/use-cases/create-shift-template.use-case.interface';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { ShiftGeneratorService } from '../../infrastructure/services/shift-generator.service';
import { ShiftTemplate } from '../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../dto/create-shift-template.dto';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { SHIFT_NOTIFICATION } from '../constants/shift-notification.constants';
import { IUserRepository } from '../../../auth/application/ports/repositories/user-repository.interface';
import { IJobRepository } from '../../../job/application/ports/repositories/job-repository.interface';
import { JobStatus } from '@/modules/job/domain/job.entity';

@Injectable()
export class CreateShiftTemplateUseCase implements ICreateShiftTemplateUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('IShiftGeneratorService')
    private readonly _shiftGenerator: ShiftGeneratorService,
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IJobRepository')
    private readonly _jobRepository: IJobRepository,

    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
  ) {}

  async execute(dto: CreateShiftTemplateDto): Promise<ShiftTemplate> {
    const employee = await this._userRepository.findById(dto.employeeId);
    if (!employee || employee.tenantId !== dto.tenantId) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.EMPLOYEE_NOT_FOUND);
    }
    if (employee.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.EMPLOYEE_BLOCKED);
    }

    const overlapping = await this._shiftTemplateRepository.findOverlapping(
      dto.tenantId,
      dto.employeeId,
      dto.startDate,
      dto.endDate,
    );

    if (overlapping) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.SHIFT_TEMPLATE_ALREADY_EXISTS,
      );
    }

    if (!dto.jobs || dto.jobs.length === 0) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.AT_LEAST_ONE_JOB_MUST_BE_ASSIGNED,
      );
    }
    for (const jobDto of dto.jobs) {
      const job = await this._jobRepository.findByTenantAndId(
        dto.tenantId,
        jobDto.jobId,
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

    return this._txManager.run(async (ctx: ITransactionContext) => {
      const template = await this._jobTemplateCreation(dto, ctx);

      const today = new Date();
      const startOfToday = new Date(today);
      startOfToday.setUTCHours(0, 0, 0, 0);

      const templateStart = new Date(dto.startDate);
      templateStart.setUTCHours(0, 0, 0, 0);

      if (templateStart.getTime() === startOfToday.getTime()) {
        await this._shiftGenerator.generateForTemplate(
          template.id,
          today,
          dto.createdByUserId,
          ctx,
        );
      }

      const finalTemplate =
        await this._shiftTemplateRepository.findByTenantAndId(
          dto.tenantId,
          template.id,
          ctx,
        );

      await this._createNotificationUseCase.execute({
        tenantId: dto.tenantId,
        userId: dto.employeeId,
        type: NotificationType.SHIFT_CREATED,
        title: SHIFT_NOTIFICATION.CREATED.title,
        message: SHIFT_NOTIFICATION.CREATED.message,
      });
      return finalTemplate!;
    });
  }

  private async _jobTemplateCreation(
    dto: CreateShiftTemplateDto,
    ctx: ITransactionContext,
  ): Promise<ShiftTemplate> {
    try {
      const shift = await this._shiftTemplateRepository.create(dto, ctx);

      return shift;
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestError(
          e.message || MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_SHIFT_TEMPLATE,
        );
      } else {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_SHIFT_TEMPLATE,
        );
      }
    }
  }
}
