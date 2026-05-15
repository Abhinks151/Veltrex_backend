import { Inject } from '@nestjs/common';
import { User } from '../../domain/entities/user.entity';
import { IUserResetPasswordUseCase } from '../ports/use-cases/reset-password.use-case.interface';
import { IPasswordResetTokenRepository } from '../ports/repositories/password-reset-repository.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { ITokenGenerator } from '../ports/services/token-generator.interface';
import { IPasswordService } from '../ports/services/password-service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';

export class UserResetPasswordUseCase implements IUserResetPasswordUseCase {
  constructor(
    @Inject('IPasswordResetTokenRepository')
    private readonly _passwordResetTokenRepository: IPasswordResetTokenRepository,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ITokenGenerator')
    private readonly _tokenGenerator: ITokenGenerator,

    @Inject('IPasswordService')
    private readonly _passwordService: IPasswordService,
  ) {}

  async execute(token: string, password: string): Promise<User> {
    const hasedToken = this._tokenGenerator.hash(token);

    const tokenExist =
      await this._passwordResetTokenRepository.findToken(hasedToken);

    if (!tokenExist) {
      throw new BadRequestError('Token not found');
    }

    if (tokenExist.expiresAt < new Date()) {
      throw new BadRequestError('Token expired');
    }

    const hashedPassowrd = await this._passwordService.hash(password);

    const user = await this._userRepository.findById(
      tokenExist.userId.toString(),
    );

    if (!user) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    // console.log(tokenExist);
    const updateUser = await this._userRepository.update(
      tokenExist.userId.toString(),
      {
        password: hashedPassowrd,
      },
    );

    if (!updateUser) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    await this._passwordResetTokenRepository.deleteToken(tokenExist.id);
    return updateUser;
  }
}
