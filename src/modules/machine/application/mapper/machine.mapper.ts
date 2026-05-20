import { Machine } from '../../domain/machine.entity';
import { MachineType } from '@/shared/enums/machine-type.enum';
import { MachineStatus } from '@/shared/enums/machine-status.enum';

interface RawMachine {
  id: string;
  tenantId: string;
  name: string;
  brand: string;
  maxRpm: number;
  axis: number;
  type: string;
  maxTravelSpeed: number;
  holdingSize: number;
  toolCount: number;
  status: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toMachineMapper = (machine: RawMachine): Machine => {
  return new Machine(
    machine.id,
    machine.tenantId,
    machine.name,
    machine.brand,
    machine.maxRpm,
    machine.axis,
    machine.type as MachineType,
    machine.maxTravelSpeed,
    machine.holdingSize,
    machine.toolCount,
    machine.status as MachineStatus,
    machine.isBlocked,
    machine.isDeleted,
    machine.createdAt,
    machine.updatedAt,
  );
};
