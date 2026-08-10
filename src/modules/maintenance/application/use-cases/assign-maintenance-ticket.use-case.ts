import { Inject, Injectable } from '@nestjs/common';
import { IAssignMaintenanceTicketUseCase } from '../ports/use-cases/assign-maintenance-ticket.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import {
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { ICreateNotificationUseCase } from '@/modules/notification/application/ports/use-cases/create-notification.use-case.interface';
import { Role } from '@/shared/enums';
import { NotificationType } from '@/modules/notification/domain/notification-type.enum';
import { MAINTENANCE_TICKET_NOTIFICATION } from '../constants/maintenance_ticket.notification';

@Injectable()
export class AssignMaintenanceTicketUseCase implements IAssignMaintenanceTicketUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
    @Inject('ICreateNotificationUseCase')
    private readonly _createNotificationUseCase: ICreateNotificationUseCase,
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
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TICKET_ALREADY_TAKEN);
    }

    const affected = await this._maintenanceRepository.tryAssign(id, userId);
    if (affected === 0) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TICKET_ALREADY_TAKEN);
    }

    const updated = await this._maintenanceRepository.findByIdAndTenant(
      id,
      tenantId,
    );
    if (!updated) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TICKET_NOT_FOUND);
    }

    await this._createNotificationUseCase.execute({
      tenantId: tenantId,
      roles: [Role.ADMIN],
      type: NotificationType.MAINTENANCE_TICKET_UPDATED,
      title: MAINTENANCE_TICKET_NOTIFICATION.UPDATED.title,
      message: `${MAINTENANCE_TICKET_NOTIFICATION.UPDATED.message} (Assigned)`,
    });

    return updated;
  }
}
