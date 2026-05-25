import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IPlanRepository } from '../../application/ports/repositories/plan-repository.interface';
import { Plan } from '../../domain/plan.entity';
import { toPlanMapper } from '../../application/mapper/plan.mapper';
import { Prisma } from '@prisma/client';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class PlanRepository implements IPlanRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(plan: Partial<Plan>): Promise<Plan> {
    try {
      const response = await this._prisma.plan.create({
        data: {
          code: plan.code!,
          name: plan.name!,
          description: plan.description,
          price: plan.price!,
          currency: plan.currency!,
          durationDays: plan.durationDays,
        },
      });
      return toPlanMapper(response);
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

  async update(id: string, plan: Partial<Plan>): Promise<Plan> {
    try {
      const response = await this._prisma.plan.update({
        where: { id },
        data: {
          name: plan.name,
          description: plan.description,
          price: plan.price,
          currency: plan.currency,
          durationDays: plan.durationDays,
          isBlocked: plan.isBlocked,
          isDeleted: plan.isDeleted,
        },
      });
      return toPlanMapper(response);
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

  async findById(id: string): Promise<Plan | null> {
    const response = await this._prisma.plan.findUnique({
      where: { id, isDeleted: false },
    });
    return response ? toPlanMapper(response) : null;
  }

  async findByCode(code: string): Promise<Plan | null> {
    const response = await this._prisma.plan.findUnique({
      where: { code, isDeleted: false },
    });
    return response ? toPlanMapper(response) : null;
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ plans: Plan[]; total: number }> {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

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

    const [plans, total] = await Promise.all([
      this._prisma.plan.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.plan.count({ where }),
    ]);

    return {
      plans: plans.map(toPlanMapper),
      total,
    };
  }

  async delete(id: string): Promise<void> {
    try {
      await this._prisma.plan.update({
        where: { id },
        data: { isDeleted: true },
      });
    } catch {
      throw new BadRequestError('Failed to delete plan');
    }
  }
}
