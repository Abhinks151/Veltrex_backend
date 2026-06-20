import { Inject, Injectable } from '@nestjs/common';
import { IBlockRawMaterialUseCase } from '../ports/use-cases/block-raw-material.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class BlockRawMaterialUseCase implements IBlockRawMaterialUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(id: string): Promise<RawMaterial> {
    const existing = await this._rawMaterialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND);
    }

    return await this._rawMaterialRepository.updateBlockStatus(
      id,
      !existing.isBlocked,
    );
  }
}
