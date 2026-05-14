import { IsEmail, IsString, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class RegisterUserRequestDto {
  @IsEmail({}, { message: MESSAGE_CONSTANTS.VALIDATION.EMAIL_INVALID })
  email!: string;

  @IsString()
  @MinLength(8, { message: MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_8 })
  password!: string;

  @IsString()
  @MinLength(2, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_2 })
  name!: string;
}
