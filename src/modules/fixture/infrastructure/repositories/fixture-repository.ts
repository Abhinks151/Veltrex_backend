import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { IFixtureRepository } from '../../application/ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import {
  CreateFixtureDto,
  FixtureInputDto,
} from '../../application/dto/create-fixture.dto';
import { toFixtureMapper } from '../../application/mapper/fixture.mapper';

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

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Fixture> {
    const response = await this._prisma.fixture.update({
      where: { id },
      data: { isBlocked },
    });

    return toFixtureMapper(response);
  }

  async softDelete(id: string): Promise<Fixture> {
    const response = await this._prisma.fixture.update({
      where: { id },
      data: { isDeleted: true },
    });

    return toFixtureMapper(response);
  }
}
