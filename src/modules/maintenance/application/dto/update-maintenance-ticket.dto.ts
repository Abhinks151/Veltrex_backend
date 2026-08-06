import { MaintenanceStatus } from '../../domain/maintenance-status.enum';

export class UpdateMaintenanceTicketDto {
  status?: MaintenanceStatus;
  assignedTo?: string | null;
  assignedAt?: Date | null;
  resolvedBy?: string | null;
  resolvedAt?: Date | null;
  reason?: string | null;
  actualDurationMinutes?: number | null;
  isActive?: boolean;
}
