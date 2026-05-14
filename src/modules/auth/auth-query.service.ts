import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { IUserRepository } from './application/ports/repositories/user-repository.interface';
import { IAuthQueryService } from './application/ports/services/auth-query.service.interface';
import { User } from './domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '../../shared/enums/messageConstants';
import { IPasswordService } from './application/ports/services/password-service.interface';

@Injectable()
export class AuthQueryService implements IAuthQueryService {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
  ) {}

  async validateUserForTenantCreation(userId: string): Promise<boolean> {
    const user = await this._userRepository.findByUuid(userId);
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    if (!user.canCreateTenant()) {
      throw new UnauthorizedException(
        MESSAGE_CONSTANTS.ERROR.USER_NOT_AUTHORIZED_CREATE_TENANT,
      );
    }
    return true;
  }

  async findAllAdminUsers(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ users: User[]; total: number }> {
    return this._userRepository.findAllAdminUsers(query);
  }

  async findById(id: string): Promise<User | null> {
    return await this._userRepository.findById(id);
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<User> {
    return await this._userRepository.updateBlockStatus(id, isBlocked);
  }

  async updateProfile(userId: string, name: string): Promise<User> {
    const user = await this._userRepository.update(userId, { name });
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return user;
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<User> {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const isPasswordValid = await this._passwordService.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.INVALID_CREDENTIALS,
      );
    }

    const hashedNewPassword = await this._passwordService.hash(newPassword);
    const updatedUser = await this._userRepository.update(userId, {
      password: hashedNewPassword,
    });

    if (!updatedUser) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.FAILED_TO_UPDATE_USER,
      );
    }

    return updatedUser;
  }

  async updateProfileImage(
    userId: string,
    url: string,
    key: string,
  ): Promise<User> {
    const user = await this._userRepository.update(userId, {
      profileImage: url,
      profileImageKey: key,
    });
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }
    return user;
  }
}
