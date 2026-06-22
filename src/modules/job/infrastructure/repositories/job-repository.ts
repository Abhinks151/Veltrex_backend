import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IJobRepository } from '../../application/ports/repositories/job-repository.interface';
import { Job, JobStatus, JobPriority } from '../../domain/job.entity';
import { CreateJobDto } from '../../application/dto/create-job.dto';
import { PrismaRawJob, toJobMapper } from '../../application/mapper/job.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class JobRepository
  extends BaseRepository<Job, CreateJobDto, Prisma.JobUpdateInput, PrismaRawJob>
  implements IJobRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.JOB, toJobMapper);
  }

  async create(data: CreateJobDto): Promise<Job> {
    try {
      const jobData: Prisma.JobCreateInput = {
        quantity: data.quantity,
        priority: data.priority,
        repeat: data.repeat,
        tenant: { connect: { id: data.tenantId } },
        part: { connect: { id: data.partId } },
        creator: { connect: { id: data.createdByUserId } },
        assignee: data.assignedToUserId
          ? { connect: { id: data.assignedToUserId } }
          : undefined,
      };

      return await super.create(jobData as unknown as CreateJobDto);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_JOB);
    }
  }

  async findByTenantAndId(tenantId: string, id: string): Promise<Job | null> {
    const response = await this._prisma.job.findFirst({
      where: {
        id,
        tenantId,
        isDeleted: false,
      },
    });

    return response ? this._mapper(response as unknown as PrismaRawJob) : null;
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Job[]; total: number }> {
    const { search, status, priority } = query;

    const where: Prisma.JobWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        {
          part: {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { partNumber: { contains: search, mode: 'insensitive' } },
            ],
          },
        },
      ];
    }

    if (status && status !== 'all') {
      where.status = status as JobStatus;
    }

    if (priority && priority !== 'all') {
      where.priority = priority as JobPriority;
    }

    const { items, total } = await super.findAll(query, undefined, where, {
      part: true,
    });

    return {
      items,
      total,
    };
  }

  async softDelete(id: string): Promise<Job> {
    try {
      return await super.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.JOB_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_JOB);
    }
  }
}
