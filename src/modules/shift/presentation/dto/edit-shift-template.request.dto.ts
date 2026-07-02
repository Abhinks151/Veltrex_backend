import {
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsOptional,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ShiftType, ShiftRepeatType } from '../../domain/shift.entity';

export class EditShiftTemplateJobRequest {
  @IsUUID()
  jobId!: string;

  @IsInt()
  @Min(1)
  assignedQuantity!: number;

  @IsInt()
  @Min(1)
  sequence!: number;
}

export class EditShiftTemplateRequest {
  @IsUUID()
  @IsOptional()
  employeeId?: string;

  @IsUUID()
  @IsOptional()
  machineId?: string;

  @IsEnum(ShiftType)
  @IsOptional()
  shiftType?: ShiftType;

  @IsEnum(ShiftRepeatType)
  @IsOptional()
  repeatType?: ShiftRepeatType;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => EditShiftTemplateJobRequest)
  jobs?: EditShiftTemplateJobRequest[];
}
