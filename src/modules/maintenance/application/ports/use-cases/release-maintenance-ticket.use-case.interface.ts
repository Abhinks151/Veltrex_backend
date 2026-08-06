import { MaintenanceTicket } from '@/modules/maintenance/domain/maintenance-ticket.entity';

export interface IReleaseMaintenanceTicketUseCase {
  execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<MaintenanceTicket>;
}
