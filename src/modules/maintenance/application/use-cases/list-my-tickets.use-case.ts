import { Inject, Injectable } from '@nestjs/common';
import { IListMyTicketsUseCase } from '../ports/use-cases/list-my-tickets.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class ListMyTicketsUseCase implements IListMyTicketsUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
  ) {}

  async execute(
    tenantId: string,
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    return await this._maintenanceRepository.findInProgressByAssignee(
      tenantId,
      userId,
      query,
    );
  }
}
