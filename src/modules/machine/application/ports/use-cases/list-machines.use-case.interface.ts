import { Machine } from '../../../domain/machine.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListMachinesUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ machines: Machine[]; total: number }>;
}
