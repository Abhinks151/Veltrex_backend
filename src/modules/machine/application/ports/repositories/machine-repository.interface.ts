import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Machine } from '../../../domain/machine.entity';
import {
  CreateMachineDto,
  MachineInputDto,
} from '../../dto/create-machine.dto';

export interface IMachineRepository extends IBaseRepository<
  Machine,
  CreateMachineDto,
  MachineInputDto
> {
  findById(id: string): Promise<Machine | null>;
  findByTenantAndName(tenantId: string, name: string): Promise<Machine | null>;
  findAllActive(tenantId: string): Promise<Machine[]>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Machine>;
  softDelete(id: string): Promise<Machine>;
}
