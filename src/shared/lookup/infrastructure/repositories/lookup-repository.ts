import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ILookupRepository } from '../../application/ports/repositories/lookup-repository.interface';
import { Lookup } from '../../domain/lookup.entity';
import {
  RawLookup,
  toLookupMapper,
} from '../../application/mapper/lookup.mapper';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class PrismaLookupRepository
  extends BaseRepository<
    Lookup,
    Prisma.LookupCreateInput,
    Prisma.LookupUpdateInput,
    RawLookup
  >
  implements ILookupRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.LOOKUP, toLookupMapper);
  }

  async findByCategory(
    category: string,
    tenantId?: string | null,
  ): Promise<Lookup[]> {
    const response = await this._prisma.lookup.findMany({
      where: {
        category,
        OR: [{ tenantId: null }, { tenantId: tenantId ?? null }],
        isActive: true,
      },
      orderBy: {
        sortOrder: 'asc',
      },
    });

    return response.map(this._mapper);
  }

  async findAllActive(tenantId?: string | null): Promise<Lookup[]> {
    const response = await this._prisma.lookup.findMany({
      where: {
        OR: [{ tenantId: null }, { tenantId: tenantId ?? null }],
        isActive: true,
      },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
    });

    return response.map(this._mapper);
  }
}
