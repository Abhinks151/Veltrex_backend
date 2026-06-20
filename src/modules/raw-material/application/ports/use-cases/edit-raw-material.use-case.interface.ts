import { RawMaterial } from '@/modules/raw-material/domain/raw-material.entity';

export interface RawMaterialInputDto {
  name?: string;
  dimensions?: object;
  material?: string;
  minQty?: number;
}

export interface IEditRawMaterialUseCase {
  execute(id: string, dto: RawMaterialInputDto): Promise<RawMaterial>;
}
