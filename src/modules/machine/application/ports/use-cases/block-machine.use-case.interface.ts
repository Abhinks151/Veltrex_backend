import { Machine } from '../../../domain/machine.entity';

export interface IBlockMachineUseCase {
  execute(id: string): Promise<Machine>;
}
