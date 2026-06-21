import { Part } from '../../../domain/part.entity';

export interface IDeletePartUseCase {
  execute(id: string): Promise<Part>;
}
