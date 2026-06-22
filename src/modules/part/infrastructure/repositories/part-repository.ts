import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma, PartPriority } from '@prisma/client';
import { IPartRepository } from '../../application/ports/repositories/part-repository.interface';
import { Part } from '../../domain/part.entity';
import { CreatePartDto } from '../../application/dto/create-part.dto';
import { RawPart, toPartMapper } from '../../application/mapper/part.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class PartRepository
  extends BaseRepository<Part, CreatePartDto, Prisma.PartUpdateInput, RawPart>
  implements IPartRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.PART, toPartMapper);
  }

  async create(data: CreatePartDto): Promise<Part> {
    try {
      const partData: Prisma.PartCreateInput = {
        name: data.name,
        partNumber: data.partNumber,
        description: data.description,
        material: data.material,
        operationType: data.operationType,
        dimensions: data.dimensions as Prisma.InputJsonValue,
        cycleTime: data.cycleTime,
        setupTime: data.setupTime,
        setupSheet: data.setupSheet,
        setupSheetKey: data.setupSheetKey,
        engineeringDrawing: data.engineeringDrawing,
        engineeringDrawingKey: data.engineeringDrawingKey,
        priority: data.priority,
        tenant: { connect: { id: data.tenantId } },
      };

      if (data.machineId)
        partData.machine = { connect: { id: data.machineId } };
      if (data.fixtureId)
        partData.fixture = { connect: { id: data.fixtureId } };
      if (data.rawMaterialId)
        partData.rawMaterial = { connect: { id: data.rawMaterialId } };

      return await super.create(partData as unknown as CreatePartDto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.PART_NUMBER_TAKEN);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_PART);
    }
  }

  async findByTenantAndPartNumber(
    tenantId: string,
    partNumber: string,
  ): Promise<Part | null> {
    const response = await this._prisma.part.findFirst({
      where: {
        tenantId,
        partNumber: { equals: partNumber, mode: 'insensitive' },
        isDeleted: false,
      },
    });

    return response ? this._mapper(response as unknown as RawPart) : null;
  }

  async findAllActive(tenantId: string): Promise<Part[]> {
    const response = await this._prisma.part.findMany({
      where: { tenantId, isDeleted: false, isBlocked: false },
      orderBy: { createdAt: 'desc' },
    });

    return response.map((p) => this._mapper(p as unknown as RawPart));
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto & { priority?: string },
  ): Promise<{ items: Part[]; total: number }> {
    const { search, status, priority } = query;

    const where: Prisma.PartWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { partNumber: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    if (priority && priority !== 'all') {
      where.priority = priority as PartPriority;
    }

    const { items, total } = await super.findAll(query, undefined, where);

    return {
      items,
      total,
    };
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Part> {
    try {
      return await super.update(id, { isBlocked });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_PART);
    }
  }

  async delete(id: string): Promise<Part> {
    try {
      return await super.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PART_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_PART);
    }
  }

  async countActiveByMachineId(machineId: string): Promise<number> {
    return await this._prisma.part.count({
      where: {
        machineId,
        isDeleted: false,
      },
    });
  }

  async countActiveByFixtureId(fixtureId: string): Promise<number> {
    return await this._prisma.part.count({
      where: {
        fixtureId,
        isDeleted: false,
      },
    });
  }

  async countActiveByRawMaterialId(rawMaterialId: string): Promise<number> {
    return await this._prisma.part.count({
      where: {
        rawMaterialId,
        isDeleted: false,
      },
    });
  }
}
