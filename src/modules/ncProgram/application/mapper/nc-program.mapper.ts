import { NcProgram } from '../../domain/nc-program.entity';
import { ProgramVersion } from '../../domain/program-version.entity';

export type RawProgramVersion = {
  id: string;
  tenantId: string;
  programId: string;
  versionNumber: number;
  fileUrl: string;
  fileName: string | null;
  fileSize: number | null;
  mimeType: string | null;
  description: string | null;
  createdBy: string;
  isBlocked: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type RawNcProgram = {
  id: string;
  tenantId: string;
  name: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  versions?: RawProgramVersion[];
};

export const toProgramVersionMapper = (
  raw: RawProgramVersion,
): ProgramVersion => {
  return new ProgramVersion(
    raw.id,
    raw.tenantId,
    raw.programId,
    raw.versionNumber,
    raw.fileUrl,
    raw.fileName,
    raw.fileSize,
    raw.mimeType,
    raw.description,
    raw.createdBy,
    raw.isBlocked,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
  );
};

export const toNcProgramMapper = (raw: RawNcProgram): NcProgram => {
  return new NcProgram(
    raw.id,
    raw.tenantId,
    raw.name,
    raw.isDeleted || false,
    raw.createdAt,
    raw.updatedAt,
    raw.versions ? raw.versions.map(toProgramVersionMapper) : [],
  );
};
