import { Inject, Injectable } from '@nestjs/common';
import { ICloseMaintenanceTicketUseCase } from '../ports/use-cases/close-maintenance-ticket.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { CloseMaintenanceTicketDto } from '../dto/close-maintenance-ticket.dto';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { Role } from '@/shared/enums';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { MAINTENANCE_TICKET_NOTIFICATION } from '../constants/maintenance_ticket.notification';

@Injectable()
export class CloseMaintenanceTicketUseCase implements ICloseMaintenanceTicketUseCase {
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

  async execute(
    id: string,
    tenantId: string,
    userId: string,
    dto: CloseMaintenanceTicketDto,
  ): Promise<MaintenanceTicket> {
    const existing = await this._maintenanceRepository.findByIdAndTenant(
      id,
      tenantId,
    );
    if (!existing) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TICKET_NOT_FOUND);
    }

    if (existing.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_CANNOT_BE_CLOSED,
      );
    }

    if (existing.assignedTo !== userId) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_NOT_ASSIGNED_TO_YOU,
      );
    }

    return await this._transactionManager.run(
      async (ctx: ITransactionContext) => {
        const affected = await this._maintenanceRepository.tryClose(
          id,
          userId,
          {
            status: MaintenanceStatus.CLOSED,
            resolvedBy: userId,
            resolvedAt: new Date(),
            isActive: false,
            reason: dto.reason,
            actualDurationMinutes: dto.actualDurationMinutes,
          },
          ctx,
        );

        if (affected === 0) {
          throw new ConflictError(
            MESSAGE_CONSTANTS.ERROR.FAILED_TO_CLOSE_TICKET,
          );
        }

        const activeCount =
          await this._maintenanceRepository.countActiveByMachine(
            existing.machineId,
            ctx,
          );

        if (activeCount === 0) {
          await this._machineRepository.update(
            existing.machineId,
            { status: MachineStatus.IDLE },
            ctx,
          );
        }

        const updated = await this._maintenanceRepository.findByIdAndTenant(
          id,
          tenantId,
          ctx,
        );
        if (!updated) {
          throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TICKET_NOT_FOUND);
        }

        await this._createNotificationUseCase.execute({
          tenantId: tenantId,
          roles: [Role.ADMIN],
          type: NotificationType.MAINTENANCE_TICKET_CLOSED,
          title: MAINTENANCE_TICKET_NOTIFICATION.CLOSED.title,
          message: MAINTENANCE_TICKET_NOTIFICATION.CLOSED.message,
        });

        if (existing.createdBy) {
          await this._createNotificationUseCase.execute({
            tenantId: tenantId,
            userId: existing.createdBy,
            type: NotificationType.MAINTENANCE_TICKET_CLOSED,
            title: MAINTENANCE_TICKET_NOTIFICATION.CLOSED.title,
            message: MAINTENANCE_TICKET_NOTIFICATION.CLOSED.message,
          });
        }

        return updated;
      },
    );
  }
}
