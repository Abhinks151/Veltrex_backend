import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Machine } from '../../../domain/machine.entity';
import {
  CreateMachineDto,
  UpdateMachineDto,
} from '../../dto/create-machine.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IMachineRepository extends IBaseRepository<
  Machine,
  CreateMachineDto,
  UpdateMachineDto
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
