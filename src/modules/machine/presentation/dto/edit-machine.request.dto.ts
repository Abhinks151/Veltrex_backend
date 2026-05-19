import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MachineType } from '@/shared/enums/machine-type.enum';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class EditMachineRequest {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name?: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxRpm?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  axis?: number;

  @IsOptional()
  @IsEnum(MachineType)
  type?: MachineType;

  @IsOptional()
  @IsInt()
  @Min(1)
  maxTravelSpeed?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  holdingSize?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  toolCount?: number;

  @IsOptional()
  @IsString()
  status?: string;
}
