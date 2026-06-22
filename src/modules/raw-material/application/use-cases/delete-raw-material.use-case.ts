import { Inject, Injectable } from '@nestjs/common';
import { IDeleteRawMaterialUseCase } from '../ports/use-cases/delete-raw-material.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';
import {
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICheckResourceInUseUseCase } from '@/modules/part/application/ports/use-cases/check-resource-in-use.use-case.interface';

@Injectable()
export class DeleteRawMaterialUseCase implements IDeleteRawMaterialUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
    @Inject('ICheckResourceInUseUseCase')
    private readonly _checkResourceInUseUseCase: ICheckResourceInUseUseCase,
  ) {}

  async execute(id: string): Promise<RawMaterial> {
    const existing = await this._rawMaterialRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND);
    }

    const isInUse =
      await this._checkResourceInUseUseCase.isRawMaterialInUse(id);

    if (isInUse) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_IN_USE);
    }

    return await this._rawMaterialRepository.delete(id);
  }
}
