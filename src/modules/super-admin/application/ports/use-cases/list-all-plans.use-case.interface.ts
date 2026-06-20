import { Plan } from '../../../domain/plan.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListAllPlansUseCase {
  execute(query: PaginationQueryDto): Promise<{ plans: Plan[]; total: number }>;
}
