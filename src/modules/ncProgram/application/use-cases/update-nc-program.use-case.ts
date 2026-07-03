import { Injectable, Inject } from '@nestjs/common';
import { INcProgramRepository } from '../ports/repositories/nc-program-repository.interface';
import { IProgramVersionRepository } from '../ports/repositories/program-version-repository.interface';
import { NcProgram } from '../../domain/nc-program.entity';
import {
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { UpdateNcProgramDto } from '../dto/update-program.dto';

@Injectable()
export class UpdateNcProgramUseCase {
  constructor(
    @Inject('INcProgramRepository')
    private readonly ncProgramRepository: INcProgramRepository,
    @Inject('IProgramVersionRepository')
    private readonly programVersionRepository: IProgramVersionRepository,
  ) {}

  async execute(dto: UpdateNcProgramDto): Promise<NcProgram> {
    const program = await this.ncProgramRepository.findById(dto.id);
    if (!program || program.tenantId !== dto.tenantId) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NOT_FOUND);
    }

    if (dto.name && dto.name !== program.name) {
      const existing = await this.ncProgramRepository.findByName(
        dto.name,
        dto.tenantId,
      );
      if (existing) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_TAKEN);
      }
      return this.ncProgramRepository.rename(dto.id, dto.name);
    }

    return program;
  }
}
