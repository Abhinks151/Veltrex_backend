import { OperationType } from '@/shared/enums/machining-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';
import { Prisma } from '@prisma/client';

export class EditPartDto {
  name?: string;
  partNumber?: string;
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
  setupSheetFile?: Express.Multer.File;
  engineeringDrawingFile?: Express.Multer.File;
}
