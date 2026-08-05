import { Part } from '../../domain/part.entity';
import { OperationType } from '@/shared/enums/machining-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';

export interface RawPart {
  id: string;
  tenantId: string;
  name: string;
  partNumber: string;
  description: string | null;
  material: string | null;
  operationType: string | null;
  machineId: string | null;
  fixtureId: string | null;
  rawMaterialId: string | null;
  ncProgramId: string | null;
  dimensions: Record<string, unknown> | null;
  cycleTime: string | null;
  setupTime: string | null;
  setupSheet: string | null;
  setupSheetKey: string | null;
  engineeringDrawing: string | null;
  engineeringDrawingKey: string | null;
  priority: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const toPartMapper = (part: RawPart): Part => {
  return new Part(
    part.id,
    part.tenantId,
    part.name,
    part.partNumber,
    part.description,
    part.material,
    part.operationType as OperationType,
    part.machineId,
    part.fixtureId,
    part.rawMaterialId,
    part.ncProgramId,
    part.dimensions,
    part.cycleTime,
    part.setupTime,
    part.setupSheet,
    part.setupSheetKey,
    part.engineeringDrawing,
    part.engineeringDrawingKey,
    part.priority as PartPriority,
    part.isBlocked,
    part.isDeleted,
    part.createdAt,
    part.updatedAt,
  );
};
