import { Inject, Injectable } from '@nestjs/common';
import { ICheckMachineMaintenanceUseCase } from '../ports/use-cases/check-machine-maintenance.use-case.interface';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';

@Injectable()
export class CheckMachineMaintenanceUseCase implements ICheckMachineMaintenanceUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
  ) {}

  // async execute(machineId: string): Promise<boolean> {
  //   return false;
  // }

  async hasActiveTickets(machineId: string): Promise<boolean> {
    const count =
      await this._maintenanceRepository.countActiveByMachine(machineId);
    return count > 0;
  }
}
