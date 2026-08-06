import { Inject, Injectable } from '@nestjs/common';
import { IListOpenTicketsUseCase } from '../ports/use-cases/list-open-tickets.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListOpenTicketsUseCase implements IListOpenTicketsUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    return await this._maintenanceRepository.findOpenByTenant(tenantId, query);
  }
}
