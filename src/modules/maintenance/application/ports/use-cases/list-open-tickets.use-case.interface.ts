import { MaintenanceTicket } from '../../../domain/maintenance-ticket.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface IListOpenTicketsUseCase {
  execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }>;
}
