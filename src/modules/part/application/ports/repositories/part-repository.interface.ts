import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Part } from '../../../domain/part.entity';
import { CreatePartDto } from '../../dto/create-part.dto';
import { Prisma } from '@prisma/client';

export interface IPartRepository extends IBaseRepository<
  Part,
  CreatePartDto,
  Prisma.PartUpdateInput
> {
  findById(id: string): Promise<Part | null>;
  findByTenantAndPartNumber(
    tenantId: string,
    partNumber: string,
  ): Promise<Part | null>;
  findAllActive(tenantId: string): Promise<Part[]>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto & { priority?: string },
  ): Promise<{ items: Part[]; total: number }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Part>;
  delete(id: string): Promise<Part>;
  countActiveByMachineId(machineId: string): Promise<number>;
  countActiveByFixtureId(fixtureId: string): Promise<number>;
  countActiveByRawMaterialId(rawMaterialId: string): Promise<number>;
  countActiveByNcProgramId(ncProgramId: string): Promise<number>;
}
