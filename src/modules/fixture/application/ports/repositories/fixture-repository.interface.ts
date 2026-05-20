import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Fixture } from '../../../domain/fixture.entity';
import {
  CreateFixtureDto,
  FixtureInputDto,
} from '../../dto/create-fixture.dto';

export interface IFixtureRepository extends IBaseRepository<
  Fixture,
  CreateFixtureDto,
  FixtureInputDto
> {
  findById(id: string): Promise<Fixture | null>;
  findByTenantAndName(tenantId: string, name: string): Promise<Fixture | null>;
  findAllActive(tenantId: string): Promise<Fixture[]>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ fixtures: Fixture[]; total: number }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Fixture>;
  softDelete(id: string): Promise<Fixture>;
}
