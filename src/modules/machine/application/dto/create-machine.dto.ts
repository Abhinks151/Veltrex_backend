import { MachineType } from '@/shared/enums/machining-type.enum';
import { MachineStatus } from '@/modules/machine/domain/machine-status.enum';

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
  status: MachineStatus;
}

export type MachineInputDto = Partial<CreateMachineDto>;
export type UpdateMachineDto = Partial<CreateMachineDto> & {
  isBlocked?: boolean;
};
