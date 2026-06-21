import { Part } from '../../../domain/part.entity';

export interface IBlockPartUseCase {
  execute(id: string): Promise<Part>;
}
