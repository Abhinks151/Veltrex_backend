import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IProgramVersionRepository } from '../../application/ports/repositories/program-version-repository.interface';
import { ProgramVersion } from '../../domain/program-version.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { AddVersionDto } from '../../application/dto/create-version.dto';
import { ProgramVersion as PrismaProgramVersion } from '@prisma/client';

const toVersionEntity = (raw: PrismaProgramVersion): ProgramVersion =>
  new ProgramVersion(
    raw.id,
    raw.tenantId,
    raw.programId,
    raw.versionNumber,
    raw.fileUrl,
    raw.fileName ?? null,
    raw.fileSize ?? null,
    raw.mimeType ?? null,
    raw.description ?? null,
    raw.createdBy,
    raw.isBlocked,
    raw.isDeleted,
    raw.createdAt,
    raw.updatedAt,
  );

@Injectable()
export class ProgramVersionRepository implements IProgramVersionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addVersion(data: AddVersionDto): Promise<ProgramVersion> {
    const lastVersion = await this.prisma.programVersion.findFirst({
      where: { programId: data.programId, isDeleted: false },
      orderBy: { versionNumber: 'desc' },
    });

    const nextVersionNumber = (lastVersion?.versionNumber ?? 0) + 1;

    const version = await this.prisma.programVersion.create({
      data: {
        program: { connect: { id: data.programId } },
        tenant: { connect: { id: data.tenantId } },
        creator: { connect: { id: data.createdBy } },
        versionNumber: nextVersionNumber,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        description: data.description,
      },
    });

    return toVersionEntity(version);
  }

  async findVersionById(id: string): Promise<ProgramVersion> {
    const version = await this.prisma.programVersion.findUnique({
      where: { id },
    });
    if (!version) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.VERSION_NOT_FOUND);
    }
    return toVersionEntity(version);
  }

  async countActiveVersions(programId: string): Promise<number> {
    return this.prisma.programVersion.count({
      where: { programId, isDeleted: false },
    });
  }

  async softDeleteVersion(id: string): Promise<ProgramVersion> {
    const deleted = await this.prisma.programVersion.update({
      where: { id },
      data: { isDeleted: true },
    });
    return toVersionEntity(deleted);
  }

  async toggleBlockVersion(id: string): Promise<ProgramVersion> {
    const current = await this.prisma.programVersion.findUnique({
      where: { id },
    });
    if (!current) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.VERSION_NOT_FOUND);
    }

    const updated = await this.prisma.programVersion.update({
      where: { id },
      data: { isBlocked: !current.isBlocked },
    });

    return toVersionEntity(updated);
  }

  async findLatestAvailableVersionByProgramId(
    programId: string,
  ): Promise<ProgramVersion | null> {
    const version = await this.prisma.programVersion.findFirst({
      where: { programId, isDeleted: false, isBlocked: false },
      orderBy: { versionNumber: 'desc' },
    });
    return version ? toVersionEntity(version) : null;
  }
}
