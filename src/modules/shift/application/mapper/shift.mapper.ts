import {
  ShiftTemplate,
  ShiftTemplateJob,
  ProductionShift,
  ShiftJob,
  ShiftType,
  ShiftRepeatType,
  ShiftStatus,
} from '../../domain/shift.entity';

export interface PrismaRawShiftTemplateJob {
  id: string;
  shiftTemplateId: string;
  jobId: string;
  assignedQuantity: number;
  sequence: number;
  createdAt: Date;
  updatedAt: Date;
  job?: {
    part?: {
      name: string;
      partNumber: string;
    };
  };
}

export interface PrismaRawShiftTemplate {
  id: string;
  tenantId: string;
  employeeId: string;
  shiftType: string;
  repeatType: string;
  startDate: Date;
  endDate: Date | null;
  createdByUserId: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee?: { name: string; email: string };
  templateJobs?: PrismaRawShiftTemplateJob[];
}

export interface PrismaRawShiftJob {
  id: string;
  tenantId: string;
  productionShiftId: string;
  jobId: string;
  assignedQuantity: number;
  completedQuantity: number;
  sequence: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  job?: {
    id: string;
    partId: string;
    part?: {
      name: string;
      partNumber: string;
    };
  };
}

export interface PrismaRawProductionShift {
  id: string;
  tenantId: string;
  shiftTemplateId: string | null;
  employeeId: string;
  date: Date;
  shiftType: string;
  status: string;
  createdByUserId: string | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  employee?: { name: string; email: string };
  shiftJobs?: PrismaRawShiftJob[];
}

export const toShiftTemplateJobMapper = (
  raw: PrismaRawShiftTemplateJob,
): ShiftTemplateJob => {
  return new ShiftTemplateJob(
    raw.id,
    raw.shiftTemplateId,
    raw.jobId,
    raw.assignedQuantity,
    raw.sequence,
    raw.createdAt,
    raw.updatedAt,
    raw.job
      ? {
          part: raw.job.part
            ? { name: raw.job.part.name, partNumber: raw.job.part.partNumber }
            : undefined,
        }
      : undefined,
  );
};

export const toShiftTemplateMapper = (
  raw: PrismaRawShiftTemplate,
): ShiftTemplate => {
  return new ShiftTemplate(
    raw.id,
    raw.tenantId,
    raw.employeeId,
    raw.shiftType as ShiftType,
    raw.repeatType as ShiftRepeatType,
    raw.startDate,
    raw.endDate,
    raw.createdByUserId,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
    raw.employee
      ? { name: raw.employee.name, email: raw.employee.email }
      : undefined,
    raw.templateJobs
      ? raw.templateJobs.map(toShiftTemplateJobMapper)
      : undefined,
  );
};

export const toShiftJobMapper = (raw: PrismaRawShiftJob): ShiftJob => {
  return new ShiftJob(
    raw.id,
    raw.tenantId,
    raw.productionShiftId,
    raw.jobId,
    raw.assignedQuantity,
    raw.completedQuantity,
    raw.sequence,
    raw.status as ShiftStatus,
    raw.createdAt,
    raw.updatedAt,
    raw.job
      ? {
          id: raw.job.id,
          partId: raw.job.partId,
          part: raw.job.part
            ? { name: raw.job.part.name, partNumber: raw.job.part.partNumber }
            : undefined,
        }
      : undefined,
  );
};

export const toProductionShiftMapper = (
  raw: PrismaRawProductionShift,
): ProductionShift => {
  return new ProductionShift(
    raw.id,
    raw.tenantId,
    raw.shiftTemplateId,
    raw.employeeId,
    raw.date,
    raw.shiftType as ShiftType,
    raw.status as ShiftStatus,
    raw.createdByUserId,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
    raw.employee
      ? { name: raw.employee.name, email: raw.employee.email }
      : undefined,
    raw.shiftJobs ? raw.shiftJobs.map(toShiftJobMapper) : undefined,
  );
};
