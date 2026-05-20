import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IMachineRepository } from '../../application/ports/repositories/machine-repository.interface';
import { Machine } from '../../domain/machine.entity';
import {
  CreateMachineDto,
  MachineInputDto,
} from '../../application/dto/create-machine.dto';
import { toMachineMapper } from '../../application/mapper/machine.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class MachineRepository implements IMachineRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(data: CreateMachineDto): Promise<Machine> {
    const response = await this._prisma.machine.create({
      data: {
        name: data.name,
        brand: data.brand,
        maxRpm: data.maxRpm,
        axis: data.axis,
        type: data.type,
        maxTravelSpeed: data.maxTravelSpeed,
        holdingSize: data.holdingSize,
        toolCount: data.toolCount,
        status: data.status,
        tenant: { connect: { id: data.tenantId } },
      },
    });

    return toMachineMapper(response);
  }

  async update(id: string, data: MachineInputDto): Promise<Machine> {
    const response = await this._prisma.machine.update({
      where: { id },
      data: {
        ...data,
      },
    });

    return toMachineMapper(response);
  }

  async findById(id: string): Promise<Machine | null> {
    const response = await this._prisma.machine.findUnique({
      where: { id },
    });

    return response ? toMachineMapper(response) : null;
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

    return response.map(toMachineMapper);
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ machines: Machine[]; total: number }> {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

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

    const [machines, total] = await Promise.all([
      this._prisma.machine.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this._prisma.machine.count({ where }),
    ]);

    return {
      machines: machines.map(toMachineMapper),
      total,
    };
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Machine> {
    const response = await this._prisma.machine.update({
      where: { id },
      data: { isBlocked },
    });

    return toMachineMapper(response);
  }

  async softDelete(id: string): Promise<Machine> {
    const response = await this._prisma.machine.update({
      where: { id },
      data: { isDeleted: true },
    });

    return toMachineMapper(response);
  }
}
