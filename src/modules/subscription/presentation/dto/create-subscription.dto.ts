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

  @IsString()
  planId!: string;

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
