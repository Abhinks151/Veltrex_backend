import { Injectable, Inject } from '@nestjs/common';
import { INcProgramRepository } from '../ports/repositories/nc-program-repository.interface';
import { ICreateNcProgramUseCase } from '../ports/use-cases/create-nc-program.use-case.interface';
import { CreateNcProgramDto } from '../dto/create-nc-program.dto';
import { NcProgram } from '../../domain/nc-program.entity';
import { ConflictError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreateNcProgramUseCase implements ICreateNcProgramUseCase {
  constructor(
    @Inject('INcProgramRepository')
    private readonly ncProgramRepository: INcProgramRepository,
  ) {}

  async execute(dto: CreateNcProgramDto): Promise<NcProgram> {
    const existingProgram = await this.ncProgramRepository.findByName(
      dto.name,
      dto.tenantId,
    );

    if (existingProgram) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_TAKEN);
    }

    return this.ncProgramRepository.create(dto);
  }
}
