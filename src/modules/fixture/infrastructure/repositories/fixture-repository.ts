import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IFixtureRepository } from '../../application/ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import {
  CreateFixtureDto,
  FixtureInputDto,
} from '../../application/dto/create-fixture.dto';
import { toFixtureMapper } from '../../application/mapper/fixture.mapper';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

@Injectable()
export class FixtureRepository implements IFixtureRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(data: CreateFixtureDto): Promise<Fixture> {
    const response = await this._prisma.fixture.create({
      data: {
        name: data.name,
        dimensions: data.dimensions,
        type: data.type,
        tenant: { connect: { id: data.tenantId } },
      },
    });

    return toFixtureMapper(response);
  }

  async update(id: string, data: FixtureInputDto): Promise<Fixture> {
    const response = await this._prisma.fixture.update({
      where: { id },
      data: { ...data },
    });

    return toFixtureMapper(response);
  }

  async findById(id: string): Promise<Fixture | null> {
    const response = await this._prisma.fixture.findUnique({ where: { id } });
    return response ? toFixtureMapper(response) : null;
  }

  async findByTenantAndName(
    tenantId: string,
    name: string,
  ): Promise<Fixture | null> {
    const response = await this._prisma.fixture.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: 'insensitive' },
        isDeleted: false,
      },
    });

    return response ? toFixtureMapper(response) : null;
  }

  async findAllActive(tenantId: string): Promise<Fixture[]> {
    const response = await this._prisma.fixture.findMany({
      where: { tenantId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return response.map(toFixtureMapper);
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ fixtures: Fixture[]; total: number }> {
    const { page = 1, limit = 10, search, status } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.FixtureWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (search) {
      where.OR = [{ name: { contains: search, mode: 'insensitive' } }];
    }

    if (status && status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const [fixtures, total] = await Promise.all([
      this._prisma.fixture.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this._prisma.fixture.count({ where }),
    ]);

    return {
      fixtures: fixtures.map(toFixtureMapper),
      total,
    };
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Fixture> {
    const response = await this._prisma.fixture.update({
      where: { id },
      data: { isBlocked },
    });

    return toFixtureMapper(response);
  }

  async delete(id: string): Promise<Fixture> {
    const response = await this._prisma.fixture.update({
      where: { id },
      data: { isDeleted: true },
    });

    return toFixtureMapper(response);
  }
}
