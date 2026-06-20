import { Inject, Injectable } from '@nestjs/common';
import { IGetAllActiveRawMaterialsUseCase } from '../ports/use-cases/get-all-active-raw-materials.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';

@Injectable()
export class GetAllActiveRawMaterialsUseCase implements IGetAllActiveRawMaterialsUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(tenantId: string): Promise<RawMaterial[]> {
    return await this._rawMaterialRepository.findAllActive(tenantId);
  }
}
