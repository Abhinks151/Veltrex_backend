import { MaintenanceStatus } from './maintenance-status.enum';

export class MaintenanceTicket {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly createdBy: string,
    public readonly machineId: string,
    public readonly assignedTo: string | null,
    public readonly resolvedBy: string | null,
    public readonly issue: string,
    public readonly description: string | null,
    public readonly status: MaintenanceStatus,
    public readonly reason: string | null,
    public readonly estimatedDurationMinutes: number | null,
    public readonly actualDurationMinutes: number | null,
    public readonly reportedAt: Date,
    public readonly assignedAt: Date | null,
    public readonly resolvedAt: Date | null,
    public readonly isActive: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly machine?: { name: string; brand: string },
    public readonly creator?: { name: string; email: string },
    public readonly assignee?: { name: string; email: string } | null,
    public readonly resolver?: { name: string; email: string } | null,
  ) {}
}
