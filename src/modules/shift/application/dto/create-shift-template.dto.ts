import { ShiftType, ShiftRepeatType } from '../../domain/shift.entity';

export interface CreateShiftTemplateJobDto {
  jobId: string;
  assignedQuantity: number;
  sequence: number;
}

export interface CreateShiftTemplateDto {
  tenantId: string;
  employeeId: string;
  shiftType: ShiftType;
  repeatType: ShiftRepeatType;
  startDate: Date;
  endDate?: Date | null;
  createdByUserId: string;
  jobs: CreateShiftTemplateJobDto[];
}
