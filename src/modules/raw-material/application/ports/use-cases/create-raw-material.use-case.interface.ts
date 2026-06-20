import { RawMaterial } from '../../../domain/raw-material.entity';
import { CreateRawMaterialDto } from '../../dto/create-raw-material.dto';

export interface ICreateRawMaterialUseCase {
  execute(data: CreateRawMaterialDto): Promise<RawMaterial>;
}
