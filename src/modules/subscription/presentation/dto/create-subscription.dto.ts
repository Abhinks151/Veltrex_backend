import { PlanType } from '@/shared/enums/plan-type.enum';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  tenantId!: string;

  @IsEnum(PlanType)
  plan!: PlanType;

  @IsEnum(SubscriptionStatus)
  status!: SubscriptionStatus;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsBoolean()
  @IsOptional()
  trialUsed?: boolean;

  @IsString()
  @IsOptional()
  razorpaySubscriptionId?: string;
}
