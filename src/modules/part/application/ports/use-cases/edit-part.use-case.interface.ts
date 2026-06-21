import { Part } from '../../../domain/part.entity';
import { Prisma } from '@prisma/client';

export interface IEditPartUseCase {
  execute(id: string, data: Prisma.PartUpdateInput): Promise<Part>;
}
