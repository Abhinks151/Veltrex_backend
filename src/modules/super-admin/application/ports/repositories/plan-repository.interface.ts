import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Plan } from '../../../domain/plan.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IPlanRepository extends IBaseRepository<Plan, Partial<Plan>> {
  findById(id: string): Promise<Plan | null>;
  findByCode(code: string): Promise<Plan | null>;
  findAll(query: PaginationQueryDto): Promise<{ plans: Plan[]; total: number }>;
  delete(id: string): Promise<void>;
}
