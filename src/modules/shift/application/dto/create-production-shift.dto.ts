import { ShiftType, ShiftStatus } from '../../domain/shift.entity';

export interface CreateProductionShiftDto {
  tenantId: string;
  shiftTemplateId?: string | null;
  employeeId: string;
  date: Date;
  shiftType: ShiftType;
  status?: ShiftStatus;
  createdByUserId?: string | null;
}
