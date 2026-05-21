import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { Role } from '@/shared/enums/roles.enum';

export class CreateEmployeeRequestDto {
  @IsEmail({}, { message: MESSAGE_CONSTANTS.VALIDATION.EMAIL_INVALID })
  email!: string;

  @IsString()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name!: string;

  @IsString()
  @IsEnum(Role, { message: MESSAGE_CONSTANTS.VALIDATION.ROLE_INVALID })
  role!: string;
}
