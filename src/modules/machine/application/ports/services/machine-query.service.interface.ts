import { Machine } from '../../../domain/machine.entity';

export interface IMachineQueryService {
  getById(id: string): Promise<Machine | null>;
  findAllActive(tenantId: string): Promise<Machine[]>;
}
