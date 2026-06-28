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
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  part?: {
    name: string;
    partNumber: string;
  };
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
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
    raw.part
      ? { name: raw.part.name, partNumber: raw.part.partNumber }
      : undefined,
  );
};
