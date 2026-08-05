import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MachineType } from '@/shared/enums/machining-type.enum';
import { MachineStatus } from '@/shared/enums/machine-status.enum';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class CreateMachineRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name!: string;

  @IsString()
  @IsNotEmpty()
  brand!: string;

  @IsInt()
  @Min(1)
  maxRpm!: number;

  @IsInt()
  @Min(1)
  axis!: number;

  @IsEnum(MachineType)
  type!: MachineType;

  @IsInt()
  @Min(1)
  maxTravelSpeed!: number;

  @IsInt()
  @Min(1)
  holdingSize!: number;

  @IsInt()
  @Min(1)
  toolCount!: number;

  @IsEnum(MachineStatus)
  status!: MachineStatus;
}
