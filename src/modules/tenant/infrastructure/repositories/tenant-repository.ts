import { ITenantRepository } from '../../application/ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { Injectable } from '@nestjs/common';
import { toTenantMapper } from '../../application/mapper/tenant.mapper';
import { TenantInputDto } from '../../application/dto/tenant-intput.dto';
import { Prisma } from '@prisma/client';
import { TenantCreationRequestDto } from '../../application/dto/create-tenant.dto';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import {
  ApplicationError,
  BadRequestError,
  ConflictError,
} from '@/shared/common/errors/domain-errors';

@Injectable()
export class TenantRepository implements ITenantRepository {
  constructor(private readonly prisma: PrismaService) {}

  async checkValidTenant(ownerId: string): Promise<Tenant | null> {
    try {
      const response = await this.prisma.tenant.findUnique({
        where: {
          ownerId: ownerId,
          isBlocked: false,
          isDeleted: false,
        },
      });

      if (!response) {
        return null;
      }

      return toTenantMapper(response);
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CHECK_TENANT);
    }
  }

  async create(tenant: TenantCreationRequestDto): Promise<Tenant> {
    try {
      const response = await this.prisma.tenant.create({
        data: {
          name: tenant.name,
          ownerId: tenant.ownerId,
        },
      });

      return toTenantMapper(response);
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

  async update(tenantId: string, tenant: TenantInputDto): Promise<Tenant> {
    try {
      const response = await this.prisma.tenant.update({
        where: { id: tenantId },
        data: {
          name: tenant.name,
        },
      });

      return toTenantMapper(response);
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TENANT_NAME_TAKEN);
      }

      throw new BadRequestError(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_TENANT,
      );
    }
  }

  async findByOwnerId(ownerId: string): Promise<Tenant | null> {
    const response = await this.prisma.tenant.findUnique({
      where: {
        ownerId: ownerId,
      },
    });

    if (!response) {
      return null;
    }

    return toTenantMapper(response);
  }

  async findById(id: string): Promise<Tenant | null> {
    const response = await this.prisma.tenant.findUnique({
      where: { id },
    });

    if (!response) {
      return null;
    }

    return toTenantMapper(response);
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant> {
    try {
      const response = await this.prisma.tenant.update({
        where: { id },
        data: {
          isBlocked: isBlocked,
        },
      });

      return toTenantMapper(response);
    } catch (error) {
      if (error instanceof ApplicationError) {
        throw error;
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async findByName(name: string): Promise<Tenant | null> {
    const response = await this.prisma.tenant.findFirst({
      where: {
        name: { equals: name, mode: 'insensitive' },
      },
    });

    if (!response) {
      return null;
    }

    return toTenantMapper(response);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    const { page = 1, limit = 10, search = '', status = 'all' } = query;
    const skip = (page - 1) * limit;

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

    const [tenants, total] = await Promise.all([
      this.prisma.tenant.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.tenant.count({ where }),
    ]);

    return {
      tenants: tenants.map((item: Tenant) => toTenantMapper(item)),
      total,
    };
  }
}
