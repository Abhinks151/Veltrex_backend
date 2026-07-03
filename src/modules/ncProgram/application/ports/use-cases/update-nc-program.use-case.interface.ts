import { NcProgram } from '../../../domain/nc-program.entity';
import { UpdateNcProgramDto } from '../../dto/update-program.dto';

export interface IUpdateNcProgramUseCase {
  execute(dto: UpdateNcProgramDto): Promise<NcProgram>;
}
