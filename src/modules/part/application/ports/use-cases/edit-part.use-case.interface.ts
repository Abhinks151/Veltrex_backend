import { EditPartDto } from '../../dto/edit-part.dto';
import { Part } from '../../../domain/part.entity';

export interface IEditPartUseCase {
  execute(id: string, data: EditPartDto): Promise<Part>;
}
