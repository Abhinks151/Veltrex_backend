import { ShiftTemplate } from '../../../domain/shift.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListShiftTemplatesUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: ShiftTemplate[]; total: number }>;
}
