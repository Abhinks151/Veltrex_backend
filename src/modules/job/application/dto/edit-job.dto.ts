import { JobPriority, JobStatus } from '../../domain/job.entity';

export class EditJobDto {
  partId?: string;
  quantity?: number;
  priority?: JobPriority;
  repeat?: boolean;
  status?: JobStatus;
  assignedToUserId?: string | null;
}
