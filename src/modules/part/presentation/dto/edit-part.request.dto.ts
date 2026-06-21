import { OperationType } from '@/shared/enums/operation-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';
import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class EditPartRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  partNumber?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  material?: string;

  @IsOptional()
  @IsEnum(OperationType)
  operationType?: OperationType;

  @IsOptional()
  @IsUUID()
  machineId?: string;

  @IsOptional()
  @IsUUID()
  fixtureId?: string;

  @IsOptional()
  @IsUUID()
  rawMaterialId?: string;

  @IsOptional()
  dimensions?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  cycleTime?: string;

  @IsOptional()
  @IsString()
  setupTime?: string;

  @IsOptional()
  @IsEnum(PartPriority)
  priority?: PartPriority;
}
