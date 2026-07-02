import { Part } from '../../../domain/part.entity';

export interface IGetPartByIdUseCase {
  execute(id: string): Promise<Part>;
}
