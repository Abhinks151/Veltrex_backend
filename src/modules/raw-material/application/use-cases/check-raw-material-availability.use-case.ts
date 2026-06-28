import { Inject, Injectable } from '@nestjs/common';
import { ICheckRawMaterialAvailabilityUseCase } from '../ports/use-cases/check-raw-material-availability.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';

@Injectable()
export class CheckRawMaterialAvailabilityUseCase implements ICheckRawMaterialAvailabilityUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(rawMaterialId: string, requiredQty: number): Promise<boolean> {
    const rawMaterial =
      await this._rawMaterialRepository.findById(rawMaterialId);

    if (!rawMaterial || rawMaterial.isDeleted || rawMaterial.isBlocked) {
      return false;
    }

    return rawMaterial.currentQty >= requiredQty;
  }
}
