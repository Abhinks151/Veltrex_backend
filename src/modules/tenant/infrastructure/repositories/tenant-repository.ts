import { ITenantRepository } from '../../application/ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { Injectable } from '@nestjs/common';
import { toTenantMapper } from '../../application/mapper/tenant.mapper';
import { TenantInputDto } from '../../application/dto/tenant-intput.dto';
import { Prisma } from '@prisma/client';
import { TenantCreationRequestDto } from '../../application/dto/create-tenant.dto';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import {
  ApplicationError,
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class TenantRepository
  extends BaseRepository<
    Tenant,
    TenantInputDto,
    Prisma.TenantUpdateInput,
    Prisma.TenantGetPayload<object>
  >
  implements ITenantRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.TENANT,
      toTenantMapper as unknown as (
        data: Prisma.TenantGetPayload<object>,
      ) => Tenant,
    );
  }

  async checkValidTenant(ownerId: string): Promise<Tenant | null> {
    try {
      const response = await this._prisma.tenant.findUnique({
        where: {
          ownerId: ownerId,
          isBlocked: false,
          isDeleted: false,
        },
      });

      if (!response) {
        return null;
      }

      return this._mapper(
        response as unknown as Prisma.TenantGetPayload<object>,
      );
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CHECK_TENANT);
    }
  }

  async create(tenant: TenantCreationRequestDto): Promise<Tenant> {
    try {
      const response = await this._prisma.tenant.create({
        data: {
          name: tenant.name,
          subdomain: tenant.subdomain,
          ownerId: tenant.ownerId,
        },
      });

      return this._mapper(
        response as unknown as Prisma.TenantGetPayload<object>,
      );
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(
          MESSAGE_CONSTANTS.ERROR.USER_ALREADY_HAS_TENANT,
        );
      }

      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_TENANT,
      );
    }
  }

  async findByOwnerId(ownerId: string): Promise<Tenant | null> {
    const response = await this._prisma.tenant.findUnique({
      where: {
        ownerId: ownerId,
      },
    });

    if (!response) {
      return null;
    }

    return this._mapper(response as unknown as Prisma.TenantGetPayload<object>);
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant> {
    try {
      return await super.update(id, { isBlocked });
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name: string): Promise<Tenant | null> {
    const response = await this._prisma.tenant.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!response) {
      return null;
    }

    return this._mapper(response as unknown as Prisma.TenantGetPayload<object>);
  }

  async findBySubdomain(subdomain: string): Promise<Tenant | null> {
    const response = await this._prisma.tenant.findFirst({
      where: {
        subdomain: { equals: subdomain, mode: 'insensitive' },
      },
    });

    if (!response) {
      return null;
    }

    return this._mapper(response as unknown as Prisma.TenantGetPayload<object>);
  }

  async findAll(
    query: PaginationQueryDto,
    ctx?: ITransactionContext,
  ): Promise<{ items: Tenant[]; tenants: Tenant[]; total: number }> {
    const { search = '', status = 'all' } = query;

    const where: Prisma.TenantWhereInput = {};

    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const { items, total } = await super.findAll(query, ctx, where);

    return {
      items,
      tenants: items,
      total,
    };
  }

  async markTrialAsUsed(id: string, ctx?: ITransactionContext): Promise<void> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    await model.update({
      where: { id },
      data: { trialUsed: true },
    });
  }

  async delete(id: string): Promise<Tenant> {
    try {
      return await super.delete(id);
    } catch {
      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_TENANT,
      );
    }
  }
}
