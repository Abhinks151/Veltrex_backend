import { MachineType } from '@/shared/enums/machine-type.enum';

export interface CreateMachineDto {
  tenantId: string;
  name: string;
  brand: string;
  maxRpm: number;
  axis: number;
  type: MachineType;
  maxTravelSpeed: number;
  holdingSize: number;
  toolCount: number;
  status: string;
}

export type MachineInputDto = Partial<CreateMachineDto>;
