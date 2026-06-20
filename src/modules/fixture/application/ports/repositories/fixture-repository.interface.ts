import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Fixture } from '../../../domain/fixture.entity';
import { CreateFixtureDto } from '../../dto/create-fixture.dto';
import { Prisma } from '@prisma/client';

export interface IFixtureRepository extends IBaseRepository<
  Fixture,
  CreateFixtureDto,
  Prisma.FixtureUpdateInput
> {
  findById(id: string): Promise<Fixture | null>;
  findByTenantAndName(tenantId: string, name: string): Promise<Fixture | null>;
  findAllActive(tenantId: string): Promise<Fixture[]>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Fixture[]; fixtures: Fixture[]; total: number }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Fixture>;
  delete(id: string): Promise<Fixture>;
}
