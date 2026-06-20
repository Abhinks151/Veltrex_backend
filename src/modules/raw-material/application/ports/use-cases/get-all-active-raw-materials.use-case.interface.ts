import { RawMaterial } from '@/modules/raw-material/domain/raw-material.entity';

export interface IGetAllActiveRawMaterialsUseCase {
  execute(tenantId: string): Promise<RawMaterial[]>;
}
