import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { RawMaterial } from '@/modules/raw-material/domain/raw-material.entity';

export interface IListRawMaterialsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{
    items: RawMaterial[];
    rawMaterials: RawMaterial[];
    total: number;
  }>;
}
