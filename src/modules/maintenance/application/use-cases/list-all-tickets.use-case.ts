import { Inject, Injectable } from '@nestjs/common';
import { IListAllTicketsUseCase } from '../ports/use-cases/list-all-tickets.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class ListAllTicketsUseCase implements IListAllTicketsUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
  ) {}

  async execute(
    tenantId: string,
    query: PaginationQueryDto & {
      machineId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    if (query.startDate && query.endDate) {
      const start = new Date(query.startDate);
      const end = new Date(query.endDate);
      if (end < start) {
        throw new BadRequestError(
          MESSAGE_CONSTANTS.ERROR.END_DATE_BEFORE_START_DATE,
        );
      }
    }
    return await this._maintenanceRepository.findAllByTenant(tenantId, query);
  }
}
