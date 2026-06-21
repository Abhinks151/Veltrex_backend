export enum JobPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum JobStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class Job {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly partId: string,
    public readonly quantity: number,
    public readonly priority: JobPriority,
    public readonly repeat: boolean,
    public readonly status: JobStatus,
    public readonly createdByUserId: string,
    public readonly assignedToUserId: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly part?: { name: string; partNumber: string },
  ) {}
}
