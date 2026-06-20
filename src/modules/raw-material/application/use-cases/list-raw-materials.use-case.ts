import { Inject, Injectable } from '@nestjs/common';
import { IListRawMaterialsUseCase } from '../ports/use-cases/list-raw-materials.use-case.interface';
import { IRawMaterialRepository } from '../ports/repositories/raw-material-repository.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { RawMaterial } from '../../domain/raw-material.entity';

@Injectable()
export class ListRawMaterialsUseCase implements IListRawMaterialsUseCase {
  constructor(
    @Inject('IRawMaterialRepository')
    private readonly _rawMaterialRepository: IRawMaterialRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{
    items: RawMaterial[];
    rawMaterials: RawMaterial[];
    total: number;
  }> {
    return await this._rawMaterialRepository.findAllPaginated(tenantId, query);
  }
}
