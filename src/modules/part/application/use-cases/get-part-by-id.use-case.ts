import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IGetPartByIdUseCase } from '../ports/use-cases/get-part-by-id.use-case.interface';
import { Part } from '../../domain/part.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { IProgramVersionRepository } from '@/modules/ncProgram/application/ports/repositories/program-version-repository.interface';

export interface PartWithNcFileUrl extends Part {
  ncProgramFileUrl: string | null;
}

@Injectable()
export class GetPartByIdUseCase implements IGetPartByIdUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
    @Inject('IProgramVersionRepository')
    private readonly _programVersionRepository: IProgramVersionRepository,
  ) {}

  async execute(id: string): Promise<PartWithNcFileUrl> {
    const part = await this._partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
    }

    let ncProgramFileUrl: string | null = null;
    if (part.ncProgramId) {
      const latestVersion =
        await this._programVersionRepository.findLatestAvailableVersionByProgramId(
          part.ncProgramId,
        );
      ncProgramFileUrl = latestVersion?.fileUrl ?? null;
    }

    return { ...part, ncProgramFileUrl };
  }
}
