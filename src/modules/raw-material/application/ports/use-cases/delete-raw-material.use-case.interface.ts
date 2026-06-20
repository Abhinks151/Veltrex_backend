import { RawMaterial } from '@/modules/raw-material/domain/raw-material.entity';

export interface IDeleteRawMaterialUseCase {
  execute(id: string): Promise<RawMaterial>;
}
