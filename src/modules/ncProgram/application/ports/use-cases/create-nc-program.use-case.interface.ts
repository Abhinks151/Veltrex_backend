import { NcProgram } from '../../../domain/nc-program.entity';
import { CreateNcProgramDto } from '../../dto/create-nc-program.dto';

export interface ICreateNcProgramUseCase {
  execute(dto: CreateNcProgramDto): Promise<NcProgram>;
}
