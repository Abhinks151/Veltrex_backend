import { Machine } from '../../../domain/machine.entity';

export interface IGetAllActiveMachinesUseCase {
  execute(tenantId: string): Promise<Machine[]>;
}
