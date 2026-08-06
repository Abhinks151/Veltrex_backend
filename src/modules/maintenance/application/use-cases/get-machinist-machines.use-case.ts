import { Inject, Injectable } from '@nestjs/common';
import {
  IGetMachinistMachinesUseCase,
  MachinistMachineDto,
} from '../ports/use-cases/get-machinist-machines.use-case.interface';
import { IMaintenanceTicketRepository } from '../ports/repositories/maintenance-ticket-repository.interface';
import { IMachineRepository } from '@/modules/machine/application/ports/repositories/machine-repository.interface';

@Injectable()
export class GetMachinistMachinesUseCase implements IGetMachinistMachinesUseCase {
  constructor(
    @Inject('IMaintenanceTicketRepository')
    private readonly _maintenanceRepository: IMaintenanceTicketRepository,
    @Inject('IMachineRepository')
    private readonly _machineRepository: IMachineRepository,
  ) {}

  async execute(
    tenantId: string,
    machinistId: string,
  ): Promise<MachinistMachineDto[]> {
    const allowedMachineIds =
      await this._maintenanceRepository.findMachineIdsForMachinist(
        tenantId,
        machinistId,
      );

    if (allowedMachineIds.length === 0) {
      return [];
    }

    const allActiveMachines =
      await this._machineRepository.findAllActive(tenantId);
    const machinistMachines = allActiveMachines.filter((machine) =>
      allowedMachineIds.includes(machine.id),
    );

    return machinistMachines.map((m) => ({
      id: m.id,
      name: m.name,
      brand: m.brand,
      status: m.status,
    }));
  }
}
