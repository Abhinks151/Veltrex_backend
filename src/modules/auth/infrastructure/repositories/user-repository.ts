import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { User } from '../../domain/entities/user.entity';
import { RegisterUserInput } from '../../application/dto/register-user-input.dto';
import { Prisma } from '@prisma/client';
// import { Role } from '@/shared/enums/roles.enum';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { UpdateUserInputDto } from '../../application/dto/update-user-input.dto';
import { toDomainUser } from '../../application/mapper/user.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(data: RegisterUserInput): Promise<User> {
    try {
      // return this.prisma.user.create({ data });

      const userExists = await this._prisma.user.findUnique({
        where: { email: data.email },
      });

      if (userExists) {
        throw new HttpException(
          MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      const user = await this._prisma.user.create({ data });

      // return {
      //   id: user.id,
      //   uuid: user.uuid,
      //   name: user.name,
      //   email: user.email,
      //   password: user.password,
      //   role: user.role as any,
      //   isVerified: user.is_verified,
      //   isBlocked: user.is_blocked,
      //   isDeleted: user.is_deleted,
      //   createdAt: user.createdAt,
      //   updatedAt: user.updatedAt,
      // };

      return toDomainUser(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new HttpException(
          MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS,
          HttpStatus.BAD_REQUEST,
        );
      }

      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_CREATE_USER,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { email },
    });

    if (user?.isDeleted) {
      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user?.isBlocked) {
      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user ? toDomainUser(user) : null;
  }

  async findByUuid(uuid: string): Promise<User | null> {
    const user = await this._prisma.user.findUnique({
      where: { id: uuid },
    });

    if (user?.isDeleted) {
      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
        HttpStatus.NOT_FOUND,
      );
    }

    if (user?.isBlocked) {
      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED,
        HttpStatus.BAD_REQUEST,
      );
    }

    return user ? toDomainUser(user) : null;
  }

  // async update(uuid: string, data: UpdateUserInputDto): Promise<User> {
  //   try {
  //     const user = await this._prisma.user.findUnique({
  //       where: { id: uuid },
  //     });

  //     if (user?.isDeleted) {
  //       throw new HttpException(
  //         MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
  //         HttpStatus.NOT_FOUND,
  //       );
  //     }

  //     if (user?.isBlocked) {
  //       throw new HttpException(
  //         MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED,
  //         HttpStatus.BAD_REQUEST,
  //       );
  //     }

  //     const updateData: Prisma.UserUpdateInput = { ...data };
  //     if ('is_verified' in updateData) {
  //       if ('is_verified' in data) {
  //         updateData.isVerified = data.is_verified;
  //       }
  //       // updateData.isVerified = updateData.is_verified;
  //       delete updateData.is_verified;
  //     }

  //     const updatedUser = await this._prisma.user.update({
  //       where: { id: uuid },
  //       data: updateData,
  //     });

  //     return toDomainUser(updatedUser);
  //   } catch (error) {
  //     if (error instanceof Prisma.PrismaClientKnownRequestError) {
  //       if (error.code === 'P2002') {
  //         const target = error.meta?.target as string[];

  //         if (target?.includes('email')) {
  //           throw new HttpException(
  //             MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS,
  //             HttpStatus.BAD_REQUEST,
  //           );
  //         }

  //         throw new HttpException(
  //           MESSAGE_CONSTANTS.ERROR.UNIQUE_CONSTRAINT_VIOLATION,
  //           HttpStatus.BAD_REQUEST,
  //         );
  //       }

  //       if (error.code === 'P2025') {
  //         throw new HttpException(
  //           MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
  //           HttpStatus.NOT_FOUND,
  //         );
  //       }
  //     }

  //     throw new HttpException(
  //       MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER,
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  async update(uuid: string, data: UpdateUserInputDto): Promise<User> {
    try {
      const user = await this._prisma.user.findUnique({
        where: { id: uuid },
      });

      if (!user || user.isDeleted) {
        throw new HttpException(
          MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }

      if (user.isBlocked) {
        throw new HttpException(
          MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED,
          HttpStatus.BAD_REQUEST,
        );
      }

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
            throw new HttpException(
              MESSAGE_CONSTANTS.ERROR.USER_ALREADY_EXISTS,
              HttpStatus.BAD_REQUEST,
            );
          }

          throw new HttpException(
            MESSAGE_CONSTANTS.ERROR.UNIQUE_CONSTRAINT_VIOLATION,
            HttpStatus.BAD_REQUEST,
          );
        }

        if (error.code === 'P2025') {
          throw new HttpException(
            MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
            HttpStatus.NOT_FOUND,
          );
        }
      }

      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
        throw new HttpException(
          MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND,
          HttpStatus.NOT_FOUND,
        );
      }
      throw new HttpException(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
