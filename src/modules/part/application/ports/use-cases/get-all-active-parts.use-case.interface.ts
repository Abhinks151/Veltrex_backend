import { Part } from '../../../domain/part.entity';

export interface IGetAllActivePartsUseCase {
  execute(tenantId: string): Promise<Part[]>;
}
