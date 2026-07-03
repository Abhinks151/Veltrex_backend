import { ProgramVersion } from '../../../domain/program-version.entity';

export interface IDeleteProgramVersionUseCase {
  execute(versionId: string, programId: string): Promise<ProgramVersion>;
}
