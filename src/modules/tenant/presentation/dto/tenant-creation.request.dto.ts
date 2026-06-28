import { IsOptional, IsString, Matches, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

export class TenantCreationRequestDto {
  @IsString()
  @MinLength(3, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3 })
  name!: string;

  @IsString()
  @MinLength(3, { message: 'Subdomain must be at least 3 characters long' })
  @Matches(/^[a-z0-9-]+$/, {
    message:
      'Subdomain can only contain lowercase letters, numbers, and hyphens',
  })
  subdomain!: string;

  @IsOptional()
  @IsString()
  plan?: string;
}
