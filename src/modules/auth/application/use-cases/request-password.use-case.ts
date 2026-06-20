import { Inject } from '@nestjs/common';
import { IRequestPasswordResetUseCase } from '../ports/use-cases/request-password-reset.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IPasswordResetTokenRepository } from '../ports/repositories/password-reset-repository.interface';
import { ITokenGenerator } from '../ports/services/token-generator.interface';
import { IEmailService } from '../ports/services/email-service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';
import { ConfigService } from '@nestjs/config';

export class RequestPasswordResetUseCase implements IRequestPasswordResetUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IPasswordResetTokenRepository')
    private readonly _passwordResetTokenRepository: IPasswordResetTokenRepository,

    @Inject('ITokenGenerator')
    private readonly _tokenGenerator: ITokenGenerator,

    @Inject('IEmailService')
    private readonly _emailService: IEmailService,

    private readonly _configService: ConfigService,
  ) {}
  async execute(email: string, resetLink?: string): Promise<void> {
    if (!email) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.EMAIL_REQUIRED);
    }

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    const token = this._tokenGenerator.generateToken();
    const hashedToken = this._tokenGenerator.hash(token);
    const expiresAt = new Date(
      Date.now() +
        (Number(this._configService.get<string>('RESET_TOKEN_EXPIRY')) ||
          3600000),
    );

    await this._passwordResetTokenRepository.createToken(
      user.uuid,
      hashedToken,
      expiresAt,
    );

    await this._emailService.sendPasswordResetEmail(email, token, resetLink);

    return;
  }
}
