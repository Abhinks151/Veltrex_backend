import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { RawMaterial } from '../../../domain/raw-material.entity';
import { CreateRawMaterialDto } from '../../dto/create-raw-material.dto';
import { Prisma } from '@prisma/client';

export interface IRawMaterialRepository extends IBaseRepository<
  RawMaterial,
  CreateRawMaterialDto,
  Prisma.RawMaterialUpdateInput
> {
  findById(id: string): Promise<RawMaterial | null>;
  findByTenantAndName(
    tenantId: string,
    name: string,
  ): Promise<RawMaterial | null>;
  findAllActive(tenantId: string): Promise<RawMaterial[]>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{
    items: RawMaterial[];
    rawMaterials: RawMaterial[];
    total: number;
  }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<RawMaterial>;
  delete(id: string): Promise<RawMaterial>;
}
