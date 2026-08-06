import { Inject, Injectable } from '@nestjs/common';
import { IReleaseMaintenanceTicketUseCase } from '../ports/use-cases/release-maintenance-ticket.use-case.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import {
  ConflictError,
  NotFoundError,
  BadRequestError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class ReleaseMaintenanceTicketUseCase implements IReleaseMaintenanceTicketUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
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

    if (existing.status !== MaintenanceStatus.IN_PROGRESS) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_CANNOT_BE_RELEASED,
      );
    }

    if (existing.assignedTo !== userId) {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.TICKET_NOT_ASSIGNED_TO_YOU,
      );
    }

    const affected = await this._maintenanceRepository.tryRelease(id, userId);
    if (affected === 0) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_RELEASE_TICKET);
    }

    const updated = await this._maintenanceRepository.findByIdAndTenant(
      id,
      tenantId,
    );
    if (!updated) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TICKET_NOT_FOUND);
    }

    return updated;
  }
}
