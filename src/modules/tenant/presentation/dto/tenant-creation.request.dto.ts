import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { PlanType } from '@/shared/enums/plan-type.enum';

export class TenantCreationRequestDto {
  @IsString()
  @MinLength(3, { message: MESSAGE_CONSTANTS.VALIDATION.NAME_MIN_LENGTH_3 })
  name!: string;

  @IsOptional()
  @IsEnum(PlanType)
  plan?: PlanType;
}
