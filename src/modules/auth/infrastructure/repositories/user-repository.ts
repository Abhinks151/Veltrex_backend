import { Injectable } from '@nestjs/common';
import { Prisma, User as PrismaUser } from '@prisma/client';

import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';

import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { RegisterUserInput } from '../../application/dto/register-user-input.dto';
import { UpdateUserInputDto } from '../../application/dto/update-user-input.dto';
import { toDomainUser } from '../../application/mapper/user.mapper';
import { User } from '../../domain/entities/user.entity';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class UserRepository
  extends BaseRepository<
    User,
    RegisterUserInput,
    Prisma.UserUpdateInput,
    PrismaUser
  >
  implements IUserRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.USER, toDomainUser);
  }

  async create(data: RegisterUserInput): Promise<User> {
    try {
      return await super.create(data);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_USER);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: {
        email,
        isDeleted: false,
      },
    });

    return user ? toDomainUser(user) : null;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return super.findById(uuid);
  }

  async update(id: string, data: UpdateUserInputDto): Promise<User> {
    try {
      const { is_verified, ...rest } = data;

      const updateData: Prisma.UserUpdateInput = {
        ...rest,
        ...(is_verified !== undefined && {
          isVerified: is_verified,
        }),
      };

      return await super.update(id, updateData);
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

  async delete(id: string): Promise<User> {
    try {
      return await super.delete(id);
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
      return await super.update(id, { isBlocked });
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

  async findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ items: User[]; users: User[]; total: number }> {
    const { page = 1, limit = 10, search = '', status = 'all' } = query;

    const where: Prisma.UserWhereInput = {
      role: 'ADMIN',
      isDeleted: false,
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const { items, total } = await super.findAll(
      { page, limit },
      undefined,
      where,
    );

    return {
      items,
      users: items,
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
  ): Promise<{ items: User[]; users: User[]; total: number }> {
    const { page = 1, limit = 10, search = '', status = 'all' } = query;

    const where: Prisma.UserWhereInput = {
      tenantId,
      isDeleted: false,
      role: {
        notIn: ['SUPER_ADMIN', 'ADMIN'],
      },
    };

    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (status !== 'all') {
      where.isBlocked = status === 'blocked';
    }

    const { items, total } = await super.findAll(
      { page, limit },
      undefined,
      where,
    );

    return {
      items,
      users: items,
      total,
    };
  }
}
