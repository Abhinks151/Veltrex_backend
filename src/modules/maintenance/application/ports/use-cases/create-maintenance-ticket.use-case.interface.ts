import { MaintenanceTicket } from '@/modules/maintenance/domain/maintenance-ticket.entity';
import { CreateMaintenanceTicketDto } from '../../dto/create-maintenance-ticket.dto';

export interface ICreateMaintenanceTicketUseCase {
  execute(dto: CreateMaintenanceTicketDto): Promise<MaintenanceTicket>;
}
