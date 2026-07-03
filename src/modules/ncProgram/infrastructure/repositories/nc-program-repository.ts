import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { INcProgramRepository } from '../../application/ports/repositories/nc-program-repository.interface';
import { NcProgram } from '../../domain/nc-program.entity';
import { CreateNcProgramDto } from '../../application/dto/create-nc-program.dto';
import {
  RawNcProgram,
  toNcProgramMapper,
} from '../../application/mapper/nc-program.mapper';
import { Prisma } from '@prisma/client';
import {
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';

@Injectable()
export class NcProgramRepository
  extends BaseRepository<
    NcProgram,
    CreateNcProgramDto,
    Prisma.NcProgramUpdateInput,
    RawNcProgram
  >
  implements INcProgramRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.NC_PROGRAM, toNcProgramMapper, false); // disabled softDelete for parent aggregate root
  }

  async create(data: CreateNcProgramDto): Promise<NcProgram> {
    try {
      const response = await this._prisma.$transaction(async (tx) => {
        const program = await tx.ncProgram.create({
          data: {
            name: data.name,
            tenant: { connect: { id: data.tenantId } },
            versions: {
              create: {
                versionNumber: 1,
                tenant: { connect: { id: data.tenantId } },
                fileUrl: data.initialVersion.fileUrl,
                fileName: data.initialVersion.fileName,
                fileSize: data.initialVersion.fileSize,
                mimeType: data.initialVersion.mimeType,
                description: data.initialVersion.description,
                creator: { connect: { id: data.createdBy } },
              },
            },
          },
          include: { versions: true },
        });
        return program;
      });

      return toNcProgramMapper(response as unknown as RawNcProgram);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_TAKEN);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_NC_PROGRAM,
      );
    }
  }

  async findById(
    id: string,
    ctx?: ITransactionContext,
    include?: Record<string, unknown>,
  ): Promise<NcProgram | null> {
    const response = await this._prisma.ncProgram.findFirst({
      where: { id },
      include: include || {
        versions: {
          orderBy: { versionNumber: 'asc' },
        },
      },
    });
    return response
      ? toNcProgramMapper(response as unknown as RawNcProgram)
      : null;
  }

  async findByName(name: string, tenantId: string): Promise<NcProgram | null> {
    const response = await this._prisma.ncProgram.findFirst({
      where: { name: { equals: name, mode: 'insensitive' }, tenantId },
    });
    return response
      ? toNcProgramMapper(response as unknown as RawNcProgram)
      : null;
  }

  async rename(id: string, newName: string): Promise<NcProgram> {
    try {
      return await super.update(id, {
        name: newName,
      } as Prisma.NcProgramUpdateInput);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_TAKEN);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_NC_PROGRAM,
      );
    }
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: NcProgram[]; total: number }> {
    const { page = 1, limit = 10, search } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.NcProgramWhereInput = { tenantId };

    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [raw, total] = await this._prisma.$transaction([
      this._prisma.ncProgram.findMany({
        where,
        include: {
          versions: {
            orderBy: { versionNumber: 'asc' },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.ncProgram.count({ where }),
    ]);

    return {
      items: raw.map((r) => toNcProgramMapper(r as unknown as RawNcProgram)),
      total,
    };
  }

  async findAllActive(tenantId: string): Promise<NcProgram[]> {
    const raw = await this._prisma.ncProgram.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
    return raw.map((r) => toNcProgramMapper(r as unknown as RawNcProgram));
  }
}
