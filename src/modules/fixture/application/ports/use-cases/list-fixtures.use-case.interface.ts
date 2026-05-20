import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Fixture } from '../../../domain/fixture.entity';

export interface IListFixturesUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ fixtures: Fixture[]; total: number }>;
}
