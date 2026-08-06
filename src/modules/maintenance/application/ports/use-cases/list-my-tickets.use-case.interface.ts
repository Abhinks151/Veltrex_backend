import { MaintenanceTicket } from '../../../domain/maintenance-ticket.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListMyTicketsUseCase {
  execute(
    tenantId: string,
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
}
