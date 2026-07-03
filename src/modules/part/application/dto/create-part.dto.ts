import { OperationType } from '@/shared/enums/operation-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';
import { Prisma } from '@prisma/client';

export class CreatePartDto {
  tenantId!: string;
  name!: string;
  partNumber!: string;
  description?: string;
  material?: string;
  operationType?: OperationType;
  machineId?: string;
  fixtureId?: string;
  rawMaterialId?: string;
  ncProgramId?: string;
  dimensions?: Prisma.InputJsonValue;
  cycleTime?: string;
  setupTime?: string;
  priority?: PartPriority;
  setupSheet?: string;
  setupSheetKey?: string;
  engineeringDrawing?: string;
  engineeringDrawingKey?: string;
}
