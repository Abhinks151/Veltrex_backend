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
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { Role } from '@/shared/enums';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { MAINTENANCE_TICKET_NOTIFICATION } from '../constants/maintenance_ticket.notification';

@Injectable()
export class CreateMaintenanceTicketUseCase implements ICreateMaintenanceTicketUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
    @Inject('ITransactionManager')
    private readonly _transactionManager: ITransactionManager,

    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
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

        await this._createNotificationUseCase.execute({
          tenantId: dto.tenantId,
          roles: [Role.ADMIN, Role.MAINTENANCE],
          type: NotificationType.MAINTENANCE_TICKET_CREATED,
          title: MAINTENANCE_TICKET_NOTIFICATION.CREATED.title,
          message: MAINTENANCE_TICKET_NOTIFICATION.CREATED.message,
        });

        return ticket;
      },
    );
  }
}
