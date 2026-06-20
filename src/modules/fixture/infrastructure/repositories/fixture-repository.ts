import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IFixtureRepository } from '../../application/ports/repositories/fixture-repository.interface';
import { Fixture } from '../../domain/fixture.entity';
import { CreateFixtureDto } from '../../application/dto/create-fixture.dto';
import {
  RawFixture,
  toFixtureMapper,
} from '../../application/mapper/fixture.mapper';
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
export class FixtureRepository
  extends BaseRepository<
    Fixture,
    CreateFixtureDto,
    Prisma.FixtureUpdateInput,
    RawFixture
  >
  implements IFixtureRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.FIXTURE, toFixtureMapper);
  }

  async create(data: CreateFixtureDto): Promise<Fixture> {
    try {
      const fixtureData: Prisma.FixtureCreateInput = {
        name: data.name,
        dimensions: data.dimensions as Prisma.InputJsonValue,
        type: data.type,
        tenant: { connect: { id: data.tenantId } },
      };
      return await super.create(fixtureData as unknown as CreateFixtureDto);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NAME_TAKEN);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_FIXTURE,
      );
    }
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

    return response ? this._mapper(response as unknown as RawFixture) : null;
  }

  async findAllActive(tenantId: string): Promise<Fixture[]> {
    const response = await this._prisma.fixture.findMany({
      where: { tenantId, isDeleted: false },
      orderBy: { createdAt: 'desc' },
    });

    return response.map((f) => this._mapper(f as unknown as RawFixture));
  }

  async findAllPaginated(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: Fixture[]; fixtures: Fixture[]; total: number }> {
    const { search, status } = query;

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

    const { items, total } = await super.findAll(query, undefined, where);

    return {
      items,
      fixtures: items,
      total,
    };
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Fixture> {
    try {
      return await super.update(id, { isBlocked });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_FIXTURE,
      );
    }
  }

  async delete(id: string): Promise<Fixture> {
    try {
      return await super.delete(id);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.FIXTURE_NOT_FOUND);
      }
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_FIXTURE,
      );
    }
  }
}
