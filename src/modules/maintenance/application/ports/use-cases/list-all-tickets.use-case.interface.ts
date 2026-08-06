import { MaintenanceTicket } from '@/modules/maintenance/domain/maintenance-ticket.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListAllTicketsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto & {
      machineId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
}
