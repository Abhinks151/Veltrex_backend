import { Inject, Injectable } from '@nestjs/common';
import { IListMachinistTicketsUseCase } from '../ports/use-cases/list-machinist-tickets.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListMachinistTicketsUseCase implements IListMachinistTicketsUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
  ) {}

  async execute(
    tenantId: string,
    machinistId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    return await this._maintenanceRepository.findByCreator(
      tenantId,
      machinistId,
      query,
    );
  }
}
