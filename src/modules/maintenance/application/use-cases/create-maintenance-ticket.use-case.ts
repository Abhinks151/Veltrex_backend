import { Inject, Injectable } from '@nestjs/common';
import { ICreateMaintenanceTicketUseCase } from '../ports/use-cases/create-maintenance-ticket.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';
import { CreateMaintenanceTicketDto } from '../dto/create-maintenance-ticket.dto';

@Injectable()
export class CreateMaintenanceTicketUseCase implements ICreateMaintenanceTicketUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('ITransactionManager')
    private readonly _transactionManager: ITransactionManager,
  ) {}

  async execute(dto: CreateMaintenanceTicketDto): Promise<MaintenanceTicket> {
    const allowedMachineIds =
      await this._maintenanceRepository.findMachineIdsForMachinist(
        dto.tenantId,
        dto.createdBy,
      );

    if (!allowedMachineIds.includes(dto.machineId)) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_IN_ASSIGNED_JOBS,
      );
    }

    const activeCount = await this._maintenanceRepository.countActiveByMachine(
      dto.machineId,
    );
    if (activeCount > 0) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.MACHINE_ALREADY_HAS_ACTIVE_TICKET,
      );
    }

    return await this._transactionManager.run(
      async (ctx: ITransactionContext) => {
        const ticket = await this._maintenanceRepository.create(dto, ctx);

        await this._machineRepository.update(
          dto.machineId,
          { status: MachineStatus.MAINTENANCE },
          ctx,
        );

        return ticket;
      },
    );
  }
}
