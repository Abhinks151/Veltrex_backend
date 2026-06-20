import {
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class EditRawMaterialRequest {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name?: string;

  @IsOptional()
  @IsObject()
  dimensions?: object;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  minQty?: number;
}
