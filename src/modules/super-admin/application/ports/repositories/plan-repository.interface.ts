import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Plan } from '../../../domain/plan.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';

export interface IPlanRepository extends IBaseRepository<
  Plan,
  Prisma.PlanCreateInput,
  Prisma.PlanUpdateInput
> {
  findById(id: string): Promise<Plan | null>;
  findByCode(code: string): Promise<Plan | null>;
  findAll(
    query: PaginationQueryDto,
  ): Promise<{ items: Plan[]; plans: Plan[]; total: number }>;
  delete(id: string): Promise<Plan>;
}
