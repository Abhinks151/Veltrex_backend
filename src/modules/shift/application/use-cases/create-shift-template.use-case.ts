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
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class CreateShiftTemplateUseCase implements ICreateShiftTemplateUseCase {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    private readonly _shiftGenerator: ShiftGeneratorService,
    private readonly _prisma: PrismaService,
  ) {}

  async execute(dto: CreateShiftTemplateDto): Promise<ShiftTemplate> {
    const employee = await this._prisma.user.findFirst({
      where: {
        id: dto.employeeId,
        tenantId: dto.tenantId,
        isDeleted: false,
      },
    });
    if (!employee) {
      throw new NotFoundError('Employee not found or blocked');
    }
    if (employee.isBlocked) {
      throw new BadRequestError('Employee is currently blocked');
    }

    const overlapping = await this._prisma.shiftTemplate.findFirst({
      where: {
        employeeId: dto.employeeId,
        tenantId: dto.tenantId,
        isDeleted: false,
        startDate: dto.endDate ? { lte: dto.endDate } : undefined,
        OR: [{ endDate: null }, { endDate: { gte: dto.startDate } }],
      },
    });

    if (overlapping) {
      throw new BadRequestError(
        'This employee already has an active shift template in this date range',
      );
    }

    if (!dto.jobs || dto.jobs.length === 0) {
      throw new BadRequestError('At least one job must be assigned');
    }
    for (const jobDto of dto.jobs) {
      const job = await this._prisma.job.findFirst({
        where: {
          id: jobDto.jobId,
          tenantId: dto.tenantId,
          isDeleted: false,
        },
      });
      if (!job) {
        throw new NotFoundError(`Job ${jobDto.jobId} not found`);
      }
      if (job.status === 'COMPLETED' || job.status === 'CANCELLED') {
        throw new BadRequestError(
          `Job ${jobDto.jobId} is completed or cancelled`,
        );
      }
      if (jobDto.assignedQuantity <= 0) {
        throw new BadRequestError('Assigned quantity must be greater than 0');
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
      return finalTemplate!;
    });
  }

  private async _jobTemplateCreation(
    dto: CreateShiftTemplateDto,
    ctx: ITransactionContext,
  ): Promise<ShiftTemplate> {
    try {
      return await this._shiftTemplateRepository.create(dto, ctx);
    } catch (e) {
      if (e instanceof Error) {
        throw new BadRequestError(
          e.message || 'Failed to create shift template',
        );
      } else {
        throw new BadRequestError('Failed to create shift template');
      }
    }
  }
}
