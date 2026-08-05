import { OperationType } from '@/shared/enums/machining-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';

export class Part {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly partNumber: string,
    public readonly description: string | null,
    public readonly material: string | null,
    public readonly operationType: OperationType | null,
    public readonly machineId: string | null,
    public readonly fixtureId: string | null,
    public readonly rawMaterialId: string | null,
    public readonly ncProgramId: string | null,
    public readonly dimensions: Record<string, unknown> | null,
    public readonly cycleTime: string | null,
    public readonly setupTime: string | null,
    public readonly setupSheet: string | null,
    public readonly setupSheetKey: string | null,
    public readonly engineeringDrawing: string | null,
    public readonly engineeringDrawingKey: string | null,
    public readonly priority: PartPriority,
    public readonly isBlocked: boolean,
    public readonly isDeleted: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
