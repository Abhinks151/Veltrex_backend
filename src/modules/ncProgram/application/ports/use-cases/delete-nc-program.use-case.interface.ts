import { NcProgram } from '../../../domain/nc-program.entity';

export interface IDeleteNcProgramUseCase {
  execute(id: string): Promise<NcProgram>;
}
