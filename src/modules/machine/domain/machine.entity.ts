import { MachineType } from '@/shared/enums/machining-type.enum';
import { MachineStatus } from '@/shared/enums/machine-status.enum';

export class Machine {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly brand: string,
    public readonly maxRpm: number,
    public readonly axis: number,
    public readonly type: MachineType,
    public readonly maxTravelSpeed: number,
    public readonly holdingSize: number,
    public readonly toolCount: number,
    public readonly status: MachineStatus,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
