import { ShiftTemplate } from '../../../domain/shift.entity';

export interface IDeleteShiftTemplateUseCase {
  execute(id: string, tenantId: string): Promise<ShiftTemplate>;
}
