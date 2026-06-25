import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Lookup } from '../../../domain/lookup.entity';
import { Prisma } from '@prisma/client';

export interface ILookupRepository extends IBaseRepository<
  Lookup,
  Prisma.LookupCreateInput,
  Prisma.LookupUpdateInput
> {
  findByCategory(category: string, tenantId?: string | null): Promise<Lookup[]>;
  findAllActive(tenantId?: string | null): Promise<Lookup[]>;
}
