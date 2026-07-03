import { Injectable, Inject } from '@nestjs/common';
import { IProgramVersionRepository } from '../ports/repositories/program-version-repository.interface';
import { INcProgramRepository } from '../ports/repositories/nc-program-repository.interface';
import { ProgramVersion } from '../../domain/program-version.entity';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class DeleteProgramVersionUseCase {
  constructor(
    @Inject('IProgramVersionRepository')
    private readonly programVersionRepository: IProgramVersionRepository,
    @Inject('INcProgramRepository')
    private readonly ncProgramRepository: INcProgramRepository,
  ) {}

  async execute(versionId: string, programId: string): Promise<ProgramVersion> {
    const activeCount =
      await this.programVersionRepository.countActiveVersions(programId);

    if (activeCount <= 1) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.CANNOT_DELETE_LAST_VERSION,
      );
    }

    return this.programVersionRepository.softDeleteVersion(versionId);
  }
}
