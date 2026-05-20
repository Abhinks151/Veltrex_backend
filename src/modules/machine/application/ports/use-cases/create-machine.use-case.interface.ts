import { Machine } from '../../../domain/machine.entity';
import { CreateMachineDto } from '../../dto/create-machine.dto';

export interface ICreateMachineUseCase {
  execute(dto: CreateMachineDto): Promise<Machine>;
}
