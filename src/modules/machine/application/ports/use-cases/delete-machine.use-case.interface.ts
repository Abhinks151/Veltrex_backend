import { Machine } from '../../../domain/machine.entity';

export interface IDeleteMachineUseCase {
  execute(id: string): Promise<Machine>;
}
