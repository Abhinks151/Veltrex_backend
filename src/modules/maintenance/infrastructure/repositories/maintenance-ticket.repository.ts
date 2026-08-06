import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { IMaintenanceTicketRepository } from '../../application/ports/repositories/maintenance-ticket-repository.interface';
import { MaintenanceTicket } from '../../domain/maintenance-ticket.entity';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import {
  PrismaRawMaintenanceTicket,
  toMaintenanceTicketMapper,
} from '../../application/mapper/maintenance-ticket.mapper';
import { MaintenanceStatus } from '../../domain/maintenance-status.enum';
import { CreateMaintenanceTicketDto } from '../../application/dto/create-maintenance-ticket.dto';
import { UpdateMaintenanceTicketDto } from '../../application/dto/update-maintenance-ticket.dto';

@Injectable()
export class MaintenanceTicketRepository
  extends BaseRepository<
    MaintenanceTicket,
    CreateMaintenanceTicketDto,
    UpdateMaintenanceTicketDto,
    PrismaRawMaintenanceTicket
  >
  implements IMaintenanceTicketRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.MAINTENANCE_TICKET,
      toMaintenanceTicketMapper,
    );
  }

  async create(
    dto: CreateMaintenanceTicketDto,
    ctx?: ITransactionContext,
  ): Promise<MaintenanceTicket> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.create({
      data: {
        tenant: { connect: { id: dto.tenantId } },
        creator: { connect: { id: dto.createdBy } },
        machine: { connect: { id: dto.machineId } },
        issue: dto.issue,
        description: dto.description || null,
        estimatedDurationMinutes: dto.estimatedDurationMinutes || null,
        status: MaintenanceStatus.OPEN,
        isActive: true,
      },
      include: {
        machine: { select: { name: true, brand: true } },
        creator: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
        resolver: { select: { name: true, email: true } },
      },
    });

    return this._mapper(result as unknown as PrismaRawMaintenanceTicket);
  }

  async findByIdAndTenant(
    id: string,
    tenantId: string,
    ctx?: ITransactionContext,
  ): Promise<MaintenanceTicket | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.findFirst({
      where: {
        id,
        tenantId,
        isDeleted: false,
      },
      include: {
        machine: { select: { name: true, brand: true } },
        creator: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
        resolver: { select: { name: true, email: true } },
      },
    });

    return result
      ? this._mapper(result as unknown as PrismaRawMaintenanceTicket)
      : null;
  }

  async findActiveByMachine(
    machineId: string,
    ctx?: ITransactionContext,
  ): Promise<MaintenanceTicket | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.findFirst({
      where: {
        machineId,
        isActive: true,
        isDeleted: false,
      },
      include: {
        machine: { select: { name: true, brand: true } },
        creator: { select: { name: true, email: true } },
        assignee: { select: { name: true, email: true } },
        resolver: { select: { name: true, email: true } },
      },
    });

    return result
      ? this._mapper(result as unknown as PrismaRawMaintenanceTicket)
      : null;
  }

  async countActiveByMachine(
    machineId: string,
    ctx?: ITransactionContext,
  ): Promise<number> {
    const client = resolvePrismaClient(this._prisma, ctx);
    return await client.maintenanceTicket.count({
      where: {
        machineId,
        isActive: true,
        isDeleted: false,
      },
    });
  }

  async findOpenByTenant(
    tenantId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      tenantId,
      status: MaintenanceStatus.OPEN,
      isDeleted: false,
    };

    const [items, total] = await Promise.all([
      this._prisma.maintenanceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          machine: { select: { name: true, brand: true } },
          creator: { select: { name: true, email: true } },
          assignee: { select: { name: true, email: true } },
          resolver: { select: { name: true, email: true } },
        },
      }),
      this._prisma.maintenanceTicket.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawMaintenanceTicket),
      ),
      total,
    };
  }

  async findInProgressByAssignee(
    tenantId: string,
    userId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      tenantId,
      assignedTo: userId,
      status: MaintenanceStatus.IN_PROGRESS,
      isDeleted: false,
    };

    const [items, total] = await Promise.all([
      this._prisma.maintenanceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { assignedAt: 'desc' },
        include: {
          machine: { select: { name: true, brand: true } },
          creator: { select: { name: true, email: true } },
          assignee: { select: { name: true, email: true } },
          resolver: { select: { name: true, email: true } },
        },
      }),
      this._prisma.maintenanceTicket.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawMaintenanceTicket),
      ),
      total,
    };
  }

  async findByCreator(
    tenantId: string,
    creatorId: string,
    query: PaginationQueryDto,
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    const { page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const where = {
      tenantId,
      createdBy: creatorId,
      isDeleted: false,
    };

    const [items, total] = await Promise.all([
      this._prisma.maintenanceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          machine: { select: { name: true, brand: true } },
          creator: { select: { name: true, email: true } },
          assignee: { select: { name: true, email: true } },
          resolver: { select: { name: true, email: true } },
        },
      }),
      this._prisma.maintenanceTicket.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawMaintenanceTicket),
      ),
      total,
    };
  }

  async findAllByTenant(
    tenantId: string,
    query: PaginationQueryDto & {
      machineId?: string;
      status?: string;
      startDate?: string;
      endDate?: string;
    },
  ): Promise<{ items: MaintenanceTicket[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      machineId,
      status,
      startDate,
      endDate,
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.MaintenanceTicketWhereInput = {
      tenantId,
      isDeleted: false,
    };

    if (machineId) {
      where.machineId = machineId;
    }

    if (status) {
      where.status = status as MaintenanceStatus;
    }

    if (startDate || endDate) {
      const dbFilter: Prisma.DateTimeFilter = {};
      if (startDate) {
        dbFilter.gte = new Date(startDate);
      }
      if (endDate) {
        dbFilter.lte = new Date(endDate);
      }
      where.reportedAt = dbFilter;
    }

    const [items, total] = await Promise.all([
      this._prisma.maintenanceTicket.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' },
        include: {
          machine: { select: { name: true, brand: true } },
          creator: { select: { name: true, email: true } },
          assignee: { select: { name: true, email: true } },
          resolver: { select: { name: true, email: true } },
        },
      }),
      this._prisma.maintenanceTicket.count({ where }),
    ]);

    return {
      items: items.map((item) =>
        this._mapper(item as unknown as PrismaRawMaintenanceTicket),
      ),
      total,
    };
  }

  async tryAssign(
    id: string,
    userId: string,
    ctx?: ITransactionContext,
  ): Promise<number> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.updateMany({
      where: {
        id,
        status: MaintenanceStatus.OPEN,
        isDeleted: false,
      },
      data: {
        status: MaintenanceStatus.IN_PROGRESS,
        assignedTo: userId,
        assignedAt: new Date(),
      },
    });

    return result.count;
  }

  async tryRelease(
    id: string,
    userId: string,
    ctx?: ITransactionContext,
  ): Promise<number> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.updateMany({
      where: {
        id,
        status: MaintenanceStatus.IN_PROGRESS,
        assignedTo: userId,
        isDeleted: false,
      },
      data: {
        status: MaintenanceStatus.OPEN,
        assignedTo: null,
        assignedAt: null,
      },
    });

    return result.count;
  }

  async tryClose(
    id: string,
    userId: string,
    data: {
      status: MaintenanceStatus;
      resolvedBy: string;
      resolvedAt: Date;
      isActive: boolean;
      reason: string;
      actualDurationMinutes?: number;
    },
    ctx?: ITransactionContext,
  ): Promise<number> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const result = await client.maintenanceTicket.updateMany({
      where: {
        id,
        status: MaintenanceStatus.IN_PROGRESS,
        assignedTo: userId,
        isDeleted: false,
      },
      data: {
        status: data.status,
        resolvedBy: data.resolvedBy,
        resolvedAt: data.resolvedAt,
        isActive: data.isActive,
        reason: data.reason,
        actualDurationMinutes: data.actualDurationMinutes || null,
      },
    });

    return result.count;
  }

  async findMachineIdsForMachinist(
    tenantId: string,
    machinistId: string,
  ): Promise<string[]> {
    // Get unique machines from shift jobs of this machinist
    // practice these type
    const machines = await this._prisma.machine.findMany({
      where: {
        tenantId,
        isDeleted: false,
        parts: {
          some: {
            isDeleted: false,
            jobs: {
              some: {
                isDeleted: false,
                shiftJobs: {
                  some: {
                    productionShift: {
                      employeeId: machinistId,
                      isDeleted: false,
                    },
                  },
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });

    return machines.map((m) => m.id);
  }
}
