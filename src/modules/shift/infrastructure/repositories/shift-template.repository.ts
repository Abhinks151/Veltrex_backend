import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IShiftTemplateRepository } from '../../application/ports/repositories/shift-template-repository.interface';
import { ShiftTemplate } from '../../domain/shift.entity';
import { CreateShiftTemplateDto } from '../../application/dto/create-shift-template.dto';
import {
  PrismaRawShiftTemplate,
  toShiftTemplateMapper,
} from '../../application/mapper/shift.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';

@Injectable()
export class ShiftTemplateRepository
  extends BaseRepository<
    ShiftTemplate,
    CreateShiftTemplateDto,
    Prisma.ShiftTemplateUpdateInput,
    PrismaRawShiftTemplate
  >
  implements IShiftTemplateRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.SHIFT_TEMPLATE, toShiftTemplateMapper);
  }

  async create(
    dto: CreateShiftTemplateDto,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.shiftTemplate.create({
      data: {
        tenant: { connect: { id: dto.tenantId } },
        employee: { connect: { id: dto.employeeId } },
        shiftType: dto.shiftType,
        repeatType: dto.repeatType,
        startDate: dto.startDate,
        endDate: dto.endDate || null,
        creator: { connect: { id: dto.createdByUserId } },
        templateJobs: {
          create: dto.jobs.map((job) => ({
            jobId: job.jobId,
            assignedQuantity: job.assignedQuantity,
            sequence: job.sequence,
          })),
        },
      },
      include: {
        employee: { select: { name: true, email: true } },
        templateJobs: {
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

    return this._mapper(result as unknown as PrismaRawShiftTemplate);
  }

  async findByTenantAndId(
    tenantId: string,
    id: string,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.shiftTemplate.findFirst({
      where: {
        id,
        tenantId,
        isDeleted: false,
      },
      include: {
        employee: { select: { name: true, email: true } },
        templateJobs: {
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
      ? this._mapper(result as unknown as PrismaRawShiftTemplate)
      : null;
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: ShiftTemplate[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ShiftTemplateWhereInput = {
      tenantId,
      isDeleted: false,
    };

    const [items, total] = await Promise.all([
      this._prisma.shiftTemplate.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          employee: { select: { name: true, email: true } },
          templateJobs: {
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
      this._prisma.shiftTemplate.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawShiftTemplate),
      ),
      total,
    };
  }

  async findActiveTemplatesForDate(
    date: Date,
    ctx?: ITransactionContext,
  ): Promise<ShiftTemplate[]> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const startOfToday = new Date(date);
    startOfToday.setUTCHours(0, 0, 0, 0);

    const result = await client.shiftTemplate.findMany({
      where: {
        isDeleted: false,
        startDate: { lte: startOfToday },
        OR: [{ endDate: null }, { endDate: { gte: startOfToday } }],
        employee: {
          isBlocked: false,
          isDeleted: false,
        },
      },
      include: {
        employee: { select: { name: true, email: true } },
        templateJobs: {
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

    return result.map((item) =>
      this._mapper(item as unknown as PrismaRawShiftTemplate),
    );
  }
}
