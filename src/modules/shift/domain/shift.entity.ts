export enum ShiftType {
  MORNING = 'MORNING',
  EVENING = 'EVENING',
  NIGHT = 'NIGHT',
}

export enum ShiftRepeatType {
  NONE = 'NONE',
  DAILY = 'DAILY',
}

export enum ShiftStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
}

export class ShiftTemplateJob {
  constructor(
    public readonly id: string,
    public readonly shiftTemplateId: string,
    public readonly jobId: string,
    public readonly assignedQuantity: number,
    public readonly sequence: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly job?: {
      part?: {
        name: string;
        partNumber: string;
      };
    },
  ) {}
}

export class ShiftTemplate {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly employeeId: string,
    public readonly shiftType: ShiftType,
    public readonly repeatType: ShiftRepeatType,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdByUserId: string,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly employee?: { name: string; email: string },
    public readonly templateJobs?: ShiftTemplateJob[],
  ) {}
}

export class ShiftJob {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly productionShiftId: string,
    public readonly jobId: string,
    public readonly assignedQuantity: number,
    public readonly completedQuantity: number,
    public readonly sequence: number,
    public readonly status: ShiftStatus,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly job?: {
      id: string;
      partId: string;
      part?: {
        name: string;
        partNumber: string;
      };
    },
  ) {}
}

export class ProductionShift {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly shiftTemplateId: string | null,
    public readonly employeeId: string,
    public readonly date: Date,
    public readonly shiftType: ShiftType,
    public readonly status: ShiftStatus,
    public readonly createdByUserId: string | null,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly employee?: { name: string; email: string },
    public readonly shiftJobs?: ShiftJob[],
  ) {}
}
