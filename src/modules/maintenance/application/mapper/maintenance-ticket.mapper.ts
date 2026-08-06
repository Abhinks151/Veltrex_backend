import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';

export interface PrismaRawMaintenanceTicket {
  id: string;
  tenantId: string;
  createdBy: string;
  machineId: string;
  assignedTo: string | null;
  resolvedBy: string | null;
  issue: string;
  description: string | null;
  status: string;
  reason: string | null;
  estimatedDurationMinutes: number | null;
  actualDurationMinutes: number | null;
  reportedAt: Date;
  assignedAt: Date | null;
  resolvedAt: Date | null;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;

  machine?: {
    name: string;
    brand: string;
  };
  creator?: {
    name: string;
    email: string;
  };
  assignee?: {
    name: string;
    email: string;
  } | null;
  resolver?: {
    name: string;
    email: string;
  } | null;
}

export const toMaintenanceTicketMapper = (
  raw: PrismaRawMaintenanceTicket,
): MaintenanceTicket => {
  return new MaintenanceTicket(
    raw.id,
    raw.tenantId,
    raw.createdBy,
    raw.machineId,
    raw.assignedTo,
    raw.resolvedBy,
    raw.issue,
    raw.description,
    raw.status as MaintenanceStatus,
    raw.reason,
    raw.estimatedDurationMinutes,
    raw.actualDurationMinutes,
    raw.reportedAt,
    raw.assignedAt,
    raw.resolvedAt,
    raw.isActive,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
    raw.machine
      ? { name: raw.machine.name, brand: raw.machine.brand }
      : undefined,
    raw.creator
      ? { name: raw.creator.name, email: raw.creator.email }
      : undefined,
    raw.assignee
      ? { name: raw.assignee.name, email: raw.assignee.email }
      : null,
    raw.resolver
      ? { name: raw.resolver.name, email: raw.resolver.email }
      : null,
  );
};
