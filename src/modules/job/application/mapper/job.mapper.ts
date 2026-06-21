import { Job, JobPriority, JobStatus } from '../../domain/job.entity';

export interface RawJob {
  id: string;
  tenant_id: string;
  part_id: string;
  quantity: number;
  priority: string;
  repeat: boolean;
  status: string;
  created_by: string;
  assigned_to: string | null;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface PrismaRawJob {
  id: string;
  tenantId: string;
  partId: string;
  quantity: number;
  priority: string;
  repeat: boolean;
  status: string;
  createdByUserId: string;
  assignedToUserId: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toJobMapper = (raw: PrismaRawJob): Job => {
  return new Job(
    raw.id,
    raw.tenantId,
    raw.partId,
    raw.quantity,
    raw.priority as JobPriority,
    raw.repeat,
    raw.status as JobStatus,
    raw.createdByUserId,
    raw.assignedToUserId,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
  );
};
