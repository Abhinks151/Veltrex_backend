import { JobPriority } from '../../domain/job.entity';

export class CreateJobDto {
  tenantId!: string;
  partId!: string;
  quantity!: number;
  priority!: JobPriority;
  repeat!: boolean;
  createdByUserId!: string;
}
