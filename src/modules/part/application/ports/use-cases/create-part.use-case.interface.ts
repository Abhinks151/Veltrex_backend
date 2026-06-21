import { CreatePartDto } from '../../dto/create-part.dto';
import { Part } from '../../../domain/part.entity';

export interface ICreatePartUseCase {
  execute(data: CreatePartDto): Promise<Part>;
}
