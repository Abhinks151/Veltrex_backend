import {
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { FixtureType } from '@/shared/enums/machining-type.enum';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class EditFixtureRequest {
  @IsOptional()
  @IsString()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name?: string;

  @IsOptional()
  @IsObject()
  dimensions?: object;

  @IsOptional()
  @IsEnum(FixtureType)
  type?: FixtureType;
}
