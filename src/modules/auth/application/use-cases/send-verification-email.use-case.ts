import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ISendVerificationEmailUseCase } from '../ports/use-cases/send-verification-email.use-case.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IEmailVerificationTokenRepository } from '../ports/repositories/email-verification-repository.interface';
import { ITokenGenerator } from '../ports/services/token-generator.interface';
import { IEmailService } from '../ports/services/email-service.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SendVerificationEmailUseCase implements ISendVerificationEmailUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('IEmailVerificationTokenRepository')
    private readonly _emailVerificationTokenRepository: IEmailVerificationTokenRepository,

    @Inject('ITokenGenerator')
    private readonly _tokenGenerator: ITokenGenerator,

    @Inject('IEmailService')
    private readonly _emailService: IEmailService,

    private readonly _configService: ConfigService,
  ) {}

  async execute(email: string): Promise<void> {
    if (!email) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.EMAIL_REQUIRED);
    }

    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    if (user.isVerified) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.USER_ALREADY_VERIFIED,
      );
    }

    await this._emailVerificationTokenRepository.deleteTokensByUserId(
      user.uuid,
    );

    const token = this._tokenGenerator.generateToken();
    const hashedToken = this._tokenGenerator.hash(token);

    const expiresAt = new Date(
      Date.now() +
        (Number(this._configService.get<string>('VERIFY_TOKEN_EXPIRY')) ||
          3600000),
    );

    await this._emailVerificationTokenRepository.createToken(
      user.uuid,
      hashedToken,
      expiresAt,
    );

    await this._emailService.sendVerificationEmail(email, token);
  }
}
