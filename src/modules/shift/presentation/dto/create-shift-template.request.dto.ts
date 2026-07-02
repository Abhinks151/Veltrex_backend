import {
  IsEnum,
  IsNotEmpty,
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

export class CreateShiftTemplateJobRequest {
  @IsUUID()
  @IsNotEmpty()
  jobId!: string;

  @IsInt()
  @Min(1)
  assignedQuantity!: number;

  @IsInt()
  @Min(1)
  sequence!: number;
}

export class CreateShiftTemplateRequest {
  @IsUUID()
  @IsNotEmpty()
  employeeId!: string;

  @IsEnum(ShiftType)
  @IsNotEmpty()
  shiftType!: ShiftType;

  @IsEnum(ShiftRepeatType)
  @IsNotEmpty()
  repeatType!: ShiftRepeatType;

  @IsDateString()
  @IsNotEmpty()
  startDate!: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShiftTemplateJobRequest)
  jobs!: CreateShiftTemplateJobRequest[];
}
