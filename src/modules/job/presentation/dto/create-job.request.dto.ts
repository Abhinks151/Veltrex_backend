import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { JobPriority } from '../../domain/job.entity';

export class CreateJobRequest {
  @IsNotEmpty()
  @IsUUID()
  partId!: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsNotEmpty()
  @IsEnum(JobPriority)
  priority!: JobPriority;

  @IsOptional()
  @IsBoolean()
  repeat?: boolean;

  @IsOptional()
  @IsUUID()
  assignedToUserId?: string;
}
