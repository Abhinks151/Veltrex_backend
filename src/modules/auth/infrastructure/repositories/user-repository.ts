import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserInput } from '../../application/dto/register-user-input.dto';
import { Prisma } from '@prisma/client';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { UpdateUserInputDto } from '../../application/dto/update-user-input.dto';
import { toDomainUser } from '../../application/mapper/user.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(data: RegisterUserInput): Promise<User> {
    try {
      const user = await this._prisma.user.create({ data });

      return toDomainUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictError(MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS);
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_USER);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.isDeleted) {
      return null;
    }

    return toDomainUser(user);
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { id: uuid },
    });

    if (!user || user.isDeleted) {
      return null;
    }

    return toDomainUser(user);
  }

  async update(uuid: string, data: UpdateUserInputDto): Promise<User> {
    try {
      const { is_verified, ...rest } = data;

      const updateData: Prisma.UserUpdateInput = {
        ...rest,
        ...(is_verified !== undefined && {
          isVerified: is_verified,
        }),
      };

      const updatedUser = await this._prisma.user.update({
        where: { id: uuid },
        data: updateData,
      });

      return toDomainUser(updatedUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          const target = error.meta?.target as string[];

          if (target?.includes('email')) {
            throw new ConflictError(
              MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS,
            );
          }

          throw new ConflictError(
            MESSAGE_CONSTANTS.ERROR.UNIQUE_CONSTRAINT_VIOLATION,
          );
        }

        if (error.code === 'P2025') {
          throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
        }
      }

      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER);
    }
  }

  async findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, search = '', status = 'all' } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      role: 'ADMIN',
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const [users, total] = await Promise.all([
      this._prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this._prisma.user.count({ where }),
    ]);

    return {
      users: users.map(toDomainUser),
      total,
    };
  }

  async findAllEmployees(
    tenantId: string,
    query: {
      page?: number;
      limit?: number;
      search?: string;
      status?: string;
      sort?: string;
    },
  ): Promise<{ users: User[]; total: number }> {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = 'all',
      sort = 'asc',
    } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.UserWhereInput = {
      tenantId,
      isDeleted: false,
      role: {
        not: 'SUPER_ADMIN',
      },
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const [users, total] = await Promise.all([
      this._prisma.user.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: {
          name: sort as Prisma.SortOrder,
        },
      }),
      this._prisma.user.count({ where }),
    ]);

    return {
      users: users.map(toDomainUser),
      total,
    };
  }

  async delete(id: string): Promise<User> {
    try {
      const updatedUser = await this._prisma.user.update({
        where: { id },
        data: { isDeleted: true },
      });
      return toDomainUser(updatedUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER);
    }
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<User> {
    try {
      const updatedUser = await this._prisma.user.update({
        where: { id },
        data: { isBlocked },
      });
      return toDomainUser(updatedUser);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER);
    }
  }

  async findById(id: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });

    if (!user || user.isDeleted) {
      return null;
    }

    return toDomainUser(user);
  }
}
