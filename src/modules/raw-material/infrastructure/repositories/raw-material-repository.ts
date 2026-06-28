import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IRawMaterialRepository } from '../../application/ports/repositories/raw-material-repository.interface';
import { RawMaterial } from '../../domain/raw-material.entity';
import { CreateRawMaterialDto } from '../../application/dto/create-raw-material.dto';
import {
  RawRawMaterial,
  toRawMaterialMapper,
} from '../../application/mapper/raw-material.mapper';
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
export class RawMaterialRepository
  extends BaseRepository<
    RawMaterial,
    CreateRawMaterialDto,
    Prisma.RawMaterialUpdateInput,
    RawRawMaterial
  >
  implements IRawMaterialRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.RAW_MATERIAL, toRawMaterialMapper);
  }

  async create(data: CreateRawMaterialDto): Promise<RawMaterial> {
    try {
      const rawMaterialData: Prisma.RawMaterialCreateInput = {
        name: data.name,
        dimensions: data.dimensions as Prisma.InputJsonValue,
        material: data.material,
        minQty: data.minQty,
        currentQty: data.currentQty,
        tenant: { connect: { id: data.tenantId } },
      };
      return await super.create(
        rawMaterialData as unknown as CreateRawMaterialDto,
      );
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(
          MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NAME_TAKEN,
        );
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_RAW_MATERIAL,
      );
    }
  }

  async findByTenantAndName(
    tenantId: string,
    name: string,
  ): Promise<RawMaterial | null> {
    const response = await this._prisma.rawMaterial.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: 'insensitive' },
        isDeleted: false,
      },
    });

    return response
      ? this._mapper(response as unknown as RawRawMaterial)
      : null;
  }

  async findAllActive(tenantId: string): Promise<RawMaterial[]> {
    const response = await this._prisma.rawMaterial.findMany({
      where: { tenantId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return response.map((rm) => this._mapper(rm as unknown as RawRawMaterial));
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{
    items: RawMaterial[];
    rawMaterials: RawMaterial[];
    total: number;
  }> {
    const { search, status } = query;

    const where: Prisma.RawMaterialWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { material: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const { items, total } = await super.findAll(query, undefined, where);

    return {
      items,
      rawMaterials: items,
      total,
    };
  }

  async updateBlockStatus(
    id: string,
    isBlocked: boolean,
  ): Promise<RawMaterial> {
    try {
      return await super.update(id, { isBlocked });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_RAW_MATERIAL,
      );
    }
  }

  async delete(id: string): Promise<RawMaterial> {
    try {
      return await super.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.RAW_MATERIAL_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_RAW_MATERIAL,
      );
    }
  }
}
