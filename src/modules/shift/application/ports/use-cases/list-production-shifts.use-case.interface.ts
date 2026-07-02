import { ProductionShift } from '../../../domain/shift.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListProductionShiftsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto & {
      date?: string;
      employeeId?: string;
      onlyFutureOrToday?: boolean;
    },
  ): Promise<{ items: ProductionShift[]; total: number }>;
}
