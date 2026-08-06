import { MaintenanceTicket } from '@/modules/maintenance/domain/maintenance-ticket.entity';

export interface IAssignMaintenanceTicketUseCase {
  execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<MaintenanceTicket>;
}
