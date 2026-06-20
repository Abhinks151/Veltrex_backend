import { IsOptional, IsString, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class TenantCreationRequestDto {
  @IsString()
  @MinLength(3, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3 })
  name!: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
