import { ProgramVersion } from '../../../domain/program-version.entity';
import { AddVersionDto } from '../../dto/create-version.dto';

export interface IProgramVersionRepository {
  addVersion(data: AddVersionDto): Promise<ProgramVersion>;
  findVersionById(id: string): Promise<ProgramVersion>;
  countActiveVersions(programId: string): Promise<number>;
  softDeleteVersion(id: string): Promise<ProgramVersion>;
  toggleBlockVersion(id: string): Promise<ProgramVersion>;
  findLatestAvailableVersionByProgramId(
    programId: string,
  ): Promise<ProgramVersion | null>;
}
