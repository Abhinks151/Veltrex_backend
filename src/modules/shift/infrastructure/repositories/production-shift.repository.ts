import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IProductionShiftRepository } from '../../application/ports/repositories/production-shift-repository.interface';
import { ProductionShift, ShiftJob } from '../../domain/shift.entity';
import { CreateProductionShiftDto } from '../../application/dto/create-production-shift.dto';
import {
  PrismaRawProductionShift,
  PrismaRawShiftJob,
  toProductionShiftMapper,
  toShiftJobMapper,
} from '../../application/mapper/shift.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { JobStatus } from '@/modules/job/domain/job.entity';

@Injectable()
export class ProductionShiftRepository
  extends BaseRepository<
    ProductionShift,
    CreateProductionShiftDto,
    Prisma.ProductionShiftUpdateInput,
    PrismaRawProductionShift
  >
  implements IProductionShiftRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.PRODUCTION_SHIFT,
      toProductionShiftMapper,
    );
  }

  async create(
    dto: CreateProductionShiftDto,
    ctx?: ITransactionContext,
  ): Promise<ProductionShift> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const startOfDate = new Date(dto.date);
    startOfDate.setUTCHours(0, 0, 0, 0);

    const result = await client.productionShift.create({
      data: {
        tenant: { connect: { id: dto.tenantId } },
        shiftTemplate: dto.shiftTemplateId
          ? { connect: { id: dto.shiftTemplateId } }
          : undefined,
        employee: { connect: { id: dto.employeeId } },
        date: startOfDate,
        shiftType: dto.shiftType,
        status: dto.status || 'PENDING',
        creator: dto.createdByUserId
          ? { connect: { id: dto.createdByUserId } }
          : undefined,
      },
      include: {
        employee: { select: { name: true, email: true } },
        shiftJobs: {
          include: {
            job: {
              include: {
                part: { select: { name: true, partNumber: true } },
              },
            },
          },
        },
      },
    });

    return this._mapper(result as unknown as PrismaRawProductionShift);
  }

  async findByTenantAndId(
    tenantId: string,
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ProductionShift | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.productionShift.findFirst({
      where: {
        id,
        tenantId,
        isDeleted: false,
      },
      include: {
        employee: { select: { name: true, email: true } },
        shiftJobs: {
          include: {
            job: {
              include: {
                part: { select: { name: true, partNumber: true } },
              },
            },
          },
        },
      },
    });

    return result
      ? this._mapper(result as unknown as PrismaRawProductionShift)
      : null;
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto & {
      date?: string;
      employeeId?: string;
      onlyFutureOrToday?: boolean;
    },
  ): Promise<{ items: ProductionShift[]; total: number }> {
    const { page = 1, limit = 10, date, employeeId, onlyFutureOrToday } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductionShiftWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (onlyFutureOrToday) {
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      if (date) {
        const parsedDate = new Date(date);
        parsedDate.setUTCHours(0, 0, 0, 0);
        if (parsedDate < today) {
          where.date = today;
        } else {
          where.date = parsedDate;
        }
      } else {
        where.date = {
          gte: today,
        };
      }
    } else if (date) {
      const parsedDate = new Date(date);
      parsedDate.setUTCHours(0, 0, 0, 0);
      where.date = parsedDate;
    }

    if (employeeId) {
      where.employeeId = employeeId;
    }

    const [items, total] = await Promise.all([
      this._prisma.productionShift.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { date: 'desc' },
        include: {
          employee: { select: { name: true, email: true } },
          shiftJobs: {
            include: {
              job: {
                include: {
                  part: { select: { name: true, partNumber: true } },
                },
              },
            },
          },
        },
      }),
      this._prisma.productionShift.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawProductionShift),
      ),
      total,
    };
  }

  async existsForTemplateAndDate(
    templateId: string,
    date: Date,
    ctx?: ITransactionContext,
  ): Promise<boolean> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const startOfToday = new Date(date);
    startOfToday.setUTCHours(0, 0, 0, 0);

    // Find the template to get employeeId and shiftType for the unique check
    const template = await client.shiftTemplate.findUnique({
      where: { id: templateId },
      select: { employeeId: true, shiftType: true },
    });
    if (!template) return false;

    const count = await client.productionShift.count({
      where: {
        employeeId: template.employeeId,
        shiftType: template.shiftType,
        date: startOfToday,
        isDeleted: false,
      },
    });
    return count > 0;
  }

  async findShiftJobById(
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ShiftJob | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.shiftJob.findUnique({
      where: { id },
      include: {
        job: {
          include: {
            part: { select: { name: true, partNumber: true } },
          },
        },
      },
    });
    return result
      ? toShiftJobMapper(result as unknown as PrismaRawShiftJob)
      : null;
  }

  async updateShiftJob(
    id: string,
    data: Prisma.ShiftJobUpdateInput,
    ctx?: ITransactionContext,
  ): Promise<ShiftJob> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.shiftJob.update({
      where: { id },
      data,
      include: {
        job: {
          include: {
            part: { select: { name: true, partNumber: true } },
          },
        },
      },
    });
    return toShiftJobMapper(result as unknown as PrismaRawShiftJob);
  }

  async createShiftJobs(
    shiftId: string,
    tenantId: string,
    jobs: Array<{ jobId: string; assignedQuantity: number; sequence: number }>,
    ctx?: ITransactionContext,
  ): Promise<void> {
    const client = resolvePrismaClient(this._prisma, ctx);
    await client.shiftJob.createMany({
      data: jobs.map((job) => ({
        tenantId,
        productionShiftId: shiftId,
        jobId: job.jobId,
        assignedQuantity: job.assignedQuantity,
        completedQuantity: 0,
        sequence: job.sequence,
        status: JobStatus.PENDING,
      })),
    });
  }
}
