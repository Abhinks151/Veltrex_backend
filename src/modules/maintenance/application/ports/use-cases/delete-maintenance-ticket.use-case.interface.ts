import { MaintenanceTicket } from '../../../domain/maintenance-ticket.entity';

export interface IDeleteMaintenanceTicketUseCase {
  execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<MaintenanceTicket>;
}
