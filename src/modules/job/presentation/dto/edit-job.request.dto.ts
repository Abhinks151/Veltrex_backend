import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';
import { JobPriority, JobStatus } from '../../domain/job.entity';

export class EditJobRequest {
  @IsOptional()
  @IsUUID()
  partId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @IsOptional()
  @IsEnum(JobPriority)
  priority?: JobPriority;

  @IsOptional()
  @IsBoolean()
  repeat?: boolean;

  @IsOptional()
  @IsEnum(JobStatus)
  status?: JobStatus;
}
