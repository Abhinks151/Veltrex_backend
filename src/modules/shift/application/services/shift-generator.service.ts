import { Inject, Injectable } from '@nestjs/common';
import { IShiftTemplateRepository } from '../ports/repositories/shift-template-repository.interface';
import { IProductionShiftRepository } from '../ports/repositories/production-shift-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import {
  ProductionShift,
  ShiftStatus,
  ShiftType,
} from '../../domain/shift.entity';

@Injectable()
export class ShiftGeneratorService {
  constructor(
    @Inject('IShiftTemplateRepository')
    private readonly _shiftTemplateRepository: IShiftTemplateRepository,
    @Inject('IProductionShiftRepository')
    private readonly _productionShiftRepository: IProductionShiftRepository,
    private readonly _prisma: PrismaService,
  ) {}

  async generateForTemplate(
    templateId: string,
    date: Date,
    createdByUserId: string | null,
    ctx?: ITransactionContext,
  ): Promise<ProductionShift> {
    const client = resolvePrismaClient(this._prisma, ctx);

    const template = await client.shiftTemplate.findFirst({
      where: { id: templateId, isDeleted: false },
      include: {
        employee: true,
        templateJobs: {
          include: {
            job: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundError('Shift template not found');
    }

    const startOfToday = new Date(date);
    startOfToday.setUTCHours(0, 0, 0, 0);

    const exists =
      await this._productionShiftRepository.existsForTemplateAndDate(
        templateId,
        startOfToday,
        ctx,
      );
    if (exists) {
      throw new ConflictError(
        'Production shift already generated for this template and date',
      );
    }

    if (template.employee.isBlocked || template.employee.isDeleted) {
      throw new BadRequestError(
        `Employee ${template.employee.name} is inactive or blocked`,
      );
    }

    if (!template.templateJobs || template.templateJobs.length === 0) {
      throw new BadRequestError('Shift template has no assigned jobs');
    }

    for (const tj of template.templateJobs) {
      if (tj.job.isDeleted) {
        throw new BadRequestError(`Job ${tj.jobId} is deleted`);
      }
      if (tj.job.status === 'COMPLETED' || tj.job.status === 'CANCELLED') {
        throw new BadRequestError(
          `Job ${tj.jobId} is inactive (completed or cancelled)`,
        );
      }
    }

    const productionShift = await this._productionShiftRepository.create(
      {
        tenantId: template.tenantId,
        shiftTemplateId: template.id,
        employeeId: template.employeeId,
        date: startOfToday,
        shiftType: template.shiftType as ShiftType,
        status: ShiftStatus.PENDING,
        createdByUserId,
      },
      ctx,
    );

    await this._productionShiftRepository.createShiftJobs(
      productionShift.id,
      template.tenantId,
      template.templateJobs.map((tj) => ({
        jobId: tj.jobId,
        assignedQuantity: tj.assignedQuantity,
        sequence: tj.sequence,
      })),
      ctx,
    );

    return productionShift;
  }
}
