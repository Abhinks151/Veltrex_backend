import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { IChangePasswordUseCase } from '../ports/use-cases/change-password.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IPasswordService } from '../ports/services/password-service.interface';
import { User } from '../../domain/entities/user.entity';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';

@Injectable()
export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
  ) {}

  async execute(
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
}
