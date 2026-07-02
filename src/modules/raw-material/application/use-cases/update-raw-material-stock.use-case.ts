import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { IUpdateRawMaterialStockUseCase } from '../ports/use-cases/update-raw-material-stock.use-case.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class UpdateRawMaterialStockUseCase implements IUpdateRawMaterialStockUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(id: string, quantityDelta: number): Promise<void> {
    const rawMaterial = await this._rawMaterialRepository.findById(id);
    if (!rawMaterial) {
      throw new NotFoundException(
        MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND ||
          'Raw material not found',
      );
    }

    const newQty = (rawMaterial.currentQty || 0) + quantityDelta;
    await this._rawMaterialRepository.update(id, {
      currentQty: newQty,
    });
  }
}
