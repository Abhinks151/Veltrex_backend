import { IsString, MaxLength, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class ResetPasswordRequestDto {
  @IsString()
  @MinLength(6, { message: MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MIN_LENGTH_6 })
  @MaxLength(12, {
    message: MESSAGE_CONSTANTS.VALIDATION.PASSWORD_MAX_LENGTH_12,
  })
  password!: string;
}
