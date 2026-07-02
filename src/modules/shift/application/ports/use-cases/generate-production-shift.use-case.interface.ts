import { ProductionShift } from '../../../domain/shift.entity';

export interface IGenerateProductionShiftUseCase {
  execute(
    templateId: string,
    tenantId: string,
    date: Date,
    createdByUserId: string,
  ): Promise<ProductionShift>;
}
