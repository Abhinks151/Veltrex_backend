import {
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsString,
  MinLength,
} from 'class-validator';
import { FixtureType } from '@/shared/enums/fixture-type.enum';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class CreateFixtureRequest {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name!: string;

  @IsObject()
  dimensions!: object;

  @IsEnum(FixtureType)
  type!: FixtureType;
}
