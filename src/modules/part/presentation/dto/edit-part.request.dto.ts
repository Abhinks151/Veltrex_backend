import { OperationType } from '@/shared/enums/operation-type.enum';
import { PartPriority } from '@/shared/enums/part-priority.enum';
import { Prisma } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID, Matches } from 'class-validator';

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
  @IsUUID()
  ncProgramId?: string;

  @IsOptional()
  dimensions?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'cycleTime must be in HH:MM:SS format',
  })
  cycleTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/, {
    message: 'setupTime must be in HH:MM:SS format',
  })
  setupTime?: string;

  @IsOptional()
  @IsEnum(PartPriority)
  priority?: PartPriority;
}
