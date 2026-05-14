import { IsEmail } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class ResendVerificationCodeRequestDto {
  @IsEmail({}, { message: MESSAGE_CONSTANTS.VALIDATION.EMAIL_INVALID })
  email!: string;
}
