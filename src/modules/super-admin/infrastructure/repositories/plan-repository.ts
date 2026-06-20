import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IPlanRepository } from '../../application/ports/repositories/plan-repository.interface';
import { Plan } from '../../domain/plan.entity';
import { toPlanMapper } from '../../application/mapper/plan.mapper';
import { Plan as PrismaPlan, Prisma } from '@prisma/client';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { CreatePlanDto } from '../../application/dto/create-plan.input.dto';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class PlanRepository
  extends BaseRepository<
    Plan,
    Prisma.PlanCreateInput,
    Prisma.PlanUpdateInput,
    PrismaPlan
  >
  implements IPlanRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.PLAN, toPlanMapper);
  }

  async create(data: CreatePlanDto): Promise<Plan> {
    try {
      const createData: Prisma.PlanCreateInput = {
        code: data.code,
        name: data.name,
        description: data.description ?? null,
        price: data.price,
        currency: data.currency,
        durationDays: data.durationDays ?? null,
      };

      return super.create(createData);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError('Plan with this code already exists');
      }
      throw new BadRequestError('Failed to create plan');
    }
  }

  async update(id: string, plan: Prisma.PlanUpdateInput): Promise<Plan> {
    try {
      return await super.update(id, plan);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError('Plan not found');
      }
      throw new BadRequestError('Failed to update plan');
    }
  }

  async findByCode(code: string): Promise<Plan | null> {
    const response = await this._prisma.plan.findUnique({
      where: { code, isDeleted: false },
    });
    return response ? this._mapper(response) : null;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ items: Plan[]; plans: Plan[]; total: number }> {
    const { search, status } = query;

    const where: Prisma.PlanWhereInput = {
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status === 'active') {
      where.isBlocked = false;
    } else if (status === 'blocked') {
      where.isBlocked = true;
    }

    const { items, total } = await super.findAll(query, undefined, where);

    return {
      items,
      plans: items,
      total,
    };
  }

  async delete(id: string): Promise<Plan> {
    try {
      return await super.delete(id);
    } catch {
      throw new BadRequestError('Failed to delete plan');
    }
  }
}
