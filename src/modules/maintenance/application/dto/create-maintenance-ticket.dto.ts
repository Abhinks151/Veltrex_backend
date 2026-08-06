export class CreateMaintenanceTicketDto {
  tenantId!: string;
  createdBy!: string;
  machineId!: string;
  issue!: string;
  description?: string;
  estimatedDurationMinutes?: number;
}
