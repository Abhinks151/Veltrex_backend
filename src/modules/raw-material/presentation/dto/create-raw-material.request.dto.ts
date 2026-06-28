import {
  IsInt,
  IsNotEmpty,
  IsObject,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class CreateRawMaterialRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name!: string;

  @IsObject()
  dimensions!: object;

  @IsString()
  @IsNotEmpty()
  material!: string;

  @IsInt()
  @Min(0)
  minQty!: number;

  @IsInt()
  @Min(0)
  currentQty!: number;
}
