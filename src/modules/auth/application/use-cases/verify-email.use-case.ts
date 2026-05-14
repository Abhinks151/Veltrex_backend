import { Inject, Injectable } from '@nestjs/common';
import { IVerifyEmailUseCase } from '../ports/use-cases/verify-email.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IEmailVerificationTokenRepository } from '../ports/repositories/email-verification-repository.interface';
import { ITokenGenerator } from '../ports/services/token-generator.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class VerifyEmailUseCase implements IVerifyEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IEmailVerificationTokenRepository')
    private readonly _emailVerificationTokenRepository: IEmailVerificationTokenRepository,

    @Inject('ITokenGenerator')
    private readonly _tokenGenerator: ITokenGenerator,
  ) {}

  async execute(token: string): Promise<void> {
    if (!token) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.TOKEN_REQUIRED);
    }

    const hashedToken = this._tokenGenerator.hash(token);
    const verificationToken =
      await this._emailVerificationTokenRepository.findToken(hashedToken);

    if (!verificationToken) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INVALID_EXPIRED_TOKEN);
    }

    if (new Date() > new Date(verificationToken.expiresAt)) {
      await this._emailVerificationTokenRepository.deleteToken(
        verificationToken.id,
      );
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.TOKEN_EXPIRED);
    }

    const user = await this._userRepository.findByUuid(
      verificationToken.userId,
    );
    if (!user) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    await this._userRepository.update(user.uuid, { is_verified: true });

    await this._emailVerificationTokenRepository.deleteToken(
      verificationToken.id,
    );
  }
}
