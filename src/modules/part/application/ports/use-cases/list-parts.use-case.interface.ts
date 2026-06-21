import { Part } from '../../../domain/part.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListPartsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto & { priority?: string },
  ): Promise<{ items: Part[]; total: number }>;
}
