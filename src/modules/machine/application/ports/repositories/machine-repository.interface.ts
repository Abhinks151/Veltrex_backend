import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Machine } from '../../../domain/machine.entity';
import { CreateMachineDto } from '../../dto/create-machine.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';

export interface IMachineRepository extends IBaseRepository<
  Machine,
  CreateMachineDto,
  Prisma.MachineUpdateInput
> {
  findById(id: string): Promise<Machine | null>;
  findByTenantAndName(tenantId: string, name: string): Promise<Machine | null>;
  findAllActive(tenantId: string): Promise<Machine[]>;
  findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Machine[]; machines: Machine[]; total: number }>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Machine>;
  delete(id: string): Promise<Machine>;
}
