import { MaintenanceTicket } from '../../../domain/maintenance-ticket.entity';
import { CloseMaintenanceTicketDto } from '../../dto/close-maintenance-ticket.dto';

export interface ICloseMaintenanceTicketUseCase {
  execute(
    id: string,
    tenantId: string,
    userId: string,
    dto: CloseMaintenanceTicketDto,
  ): Promise<MaintenanceTicket>;
}
