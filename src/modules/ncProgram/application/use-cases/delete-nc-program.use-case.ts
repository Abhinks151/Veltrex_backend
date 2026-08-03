import { Inject, Injectable } from '@nestjs/common';
import { IDeleteNcProgramUseCase } from '../ports/use-cases/delete-nc-program.use-case.interface';
import { INcProgramRepository } from '../ports/repositories/nc-program-repository.interface';
import { NcProgram } from '../../domain/nc-program.entity';
import {
  ConflictError,
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICheckResourceInUseUseCase } from '@/modules/part/application/ports/use-cases/check-resource-in-use.use-case.interface';

@Injectable()
export class DeleteNcProgramUseCase implements IDeleteNcProgramUseCase {
  constructor(
    @Inject('INcProgramRepository')
    private readonly _ncProgramRepository: INcProgramRepository,
    @Inject('ICheckResourceInUseUseCase')
    private readonly _checkResourceInUseUseCase: ICheckResourceInUseUseCase,
  ) {}

  async execute(id: string): Promise<NcProgram> {
    const existing = await this._ncProgramRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NOT_FOUND);
    }

    if (existing.isDeleted) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_ALREADY_DELETED,
      );
    }

    const isInUse = await this._checkResourceInUseUseCase.isNcProgramInUse(id);

    if (isInUse) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_IN_USE);
    }

    try {
      return await this._ncProgramRepository.delete(id);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }
}
