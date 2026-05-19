import { Machine } from '../../../domain/machine.entity';
import { MachineInputDto } from '../../dto/create-machine.dto';

export interface IEditMachineUseCase {
  execute(id: string, dto: MachineInputDto): Promise<Machine>;
}
