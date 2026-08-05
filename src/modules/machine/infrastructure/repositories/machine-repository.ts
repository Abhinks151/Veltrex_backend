import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IMachineRepository } from '../../application/ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import {
  CreateMachineDto,
  UpdateMachineDto,
} from '../../application/dto/create-machine.dto';
import {
  RawMachine,
  toMachineMapper,
} from '../../application/mapper/machine.mapper';
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
export class MachineRepository
  extends BaseRepository<
    Machine,
    CreateMachineDto,
    UpdateMachineDto,
    RawMachine
  >
  implements IMachineRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.MACHINE, toMachineMapper);
  }

  async create(data: CreateMachineDto): Promise<Machine> {
    try {
      return await super.create(data);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.MACHINE_NAME_TAKEN);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_MACHINE,
      );
    }
  }

  async findByTenantAndName(
    tenantId: string,
    name: string,
  ): Promise<Machine | null> {
    const response = await this._prisma.machine.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: 'insensitive' },
        isDeleted: false,
      },
    });

    return response ? toMachineMapper(response) : null;
  }

  async findAllActive(tenantId: string): Promise<Machine[]> {
    const response = await this._prisma.machine.findMany({
      where: {
        tenantId,
        isDeleted: false,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return response.map(this._mapper);
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Machine[]; machines: Machine[]; total: number }> {
    const { search, status } = query;

    const where: Prisma.MachineWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { brand: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status && status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const { items, total } = await super.findAll(query, undefined, where);

    return {
      items,
      machines: items,
      total,
    };
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Machine> {
    try {
      return await super.update(id, { isBlocked });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_MACHINE,
      );
    }
  }

  async delete(id: string): Promise<Machine> {
    try {
      return await super.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.MACHINE_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_MACHINE,
      );
    }
  }
}
