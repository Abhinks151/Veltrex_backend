import { RawMaterial } from '@/modules/raw-material/domain/raw-material.entity';

export interface IBlockRawMaterialUseCase {
  execute(id: string): Promise<RawMaterial>;
}
