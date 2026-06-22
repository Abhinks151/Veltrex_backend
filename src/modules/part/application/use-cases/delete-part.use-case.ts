import { Inject, Injectable } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IDeletePartUseCase } from '../ports/use-cases/delete-part.use-case.interface';
import { Part } from '../../domain/part.entity';
import { ConflictError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICheckPartInUseUseCase } from '@/modules/job/application/ports/use-cases/check-part-in-use.use-case.interface';

@Injectable()
export class DeletePartUseCase implements IDeletePartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
    @Inject('ICheckPartInUseUseCase')
    private readonly _checkPartInUseUseCase: ICheckPartInUseUseCase,
  ) {}

  async execute(id: string): Promise<Part> {
    const isInUse = await this._checkPartInUseUseCase.execute(id);

    if (isInUse) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.PART_IN_USE);
    }

    return await this._partRepository.delete(id);
  }
}
