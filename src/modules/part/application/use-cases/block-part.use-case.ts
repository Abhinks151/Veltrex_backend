import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPartRepository } from '../ports/repositories/part-repository.interface';
import { IBlockPartUseCase } from '../ports/use-cases/block-part.use-case.interface';
import { Part } from '../../domain/part.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class BlockPartUseCase implements IBlockPartUseCase {
  constructor(
    @Inject('IPartRepository')
    private readonly _partRepository: IPartRepository,
  ) {}

  async execute(id: string): Promise<Part> {
    const part = await this._partRepository.findById(id);
    if (!part) {
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
    }
    return await this._partRepository.updateBlockStatus(id, !part.isBlocked);
  }
}
