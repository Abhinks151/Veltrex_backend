import { Inject, Injectable } from '@nestjs/common';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  NotFoundError,
  BadRequestError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';
import { IDeleteMaintenanceTicketUseCase } from '../ports/use-cases/delete-maintenance-ticket.use-case.interface';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';

@Injectable()
export class DeleteMaintenanceTicketUseCase implements IDeleteMaintenanceTicketUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('ITransactionManager')
    private readonly _transactionManager: ITransactionManager,
  ) {}

  async execute(
    id: string,
    tenantId: string,
    userId: string,
  ): Promise<MaintenanceTicket> {
    const existing = await this._maintenanceRepository.findByIdAndTenant(
      id,
      tenantId,
    );
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TICKET_NOT_FOUND);
    }

    if (existing.status !== MaintenanceStatus.OPEN) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_CANNOT_BE_DELETED,
      );
    }

    if (existing.createdBy !== userId) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_NOT_CREATED_BY_YOU,
      );
    }

    return await this._transactionManager.run(
      async (ctx: ITransactionContext) => {
        const ticket = await this._maintenanceRepository.delete(id, ctx);
        await this._machineRepository.update(
          existing.machineId,
          { status: MachineStatus.IDLE },
          ctx,
        );
        return ticket;
      },
    );
  }
}
