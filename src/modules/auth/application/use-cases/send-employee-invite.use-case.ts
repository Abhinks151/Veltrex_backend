import { BadRequestException, Inject } from '@nestjs/common';
import { ISendEmployeeInviteUseCase } from '../ports/use-cases/send-employee-invite.use-case.interface';
import { ITokenGenerator } from '../ports/services/token-generator.interface';
import { IEmailService } from '../ports/services/email-service.interface';
import { ConfigService } from '@nestjs/config';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { IPasswordResetTokenRepository } from '../ports/repositories/password-reset-repository.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class SendEmployeeInviteUseCase implements ISendEmployeeInviteUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ITokenGenerator')
    private readonly _tokenGenerator: ITokenGenerator,

    @Inject('IEmailService')
    private readonly _emailService: IEmailService,

    @Inject('IPasswordResetTokenRepository')
    private readonly _passwordResetTokenRepository: IPasswordResetTokenRepository,

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

    if (user.isDeleted) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.USER_IS_DELETED);
    }

    // Generate reset token
    const token = this._tokenGenerator.generateToken();
    const hashedToken = this._tokenGenerator.hash(token);
    const expiresAt = new Date(
      Date.now() +
        (Number(this._configService.get<string>('RESET_TOKEN_EXPIRY')) ||
          3600000),
    );

    await this._passwordResetTokenRepository.create(
      user.id,
      hashedToken,
      expiresAt,
    );

    await this._emailService.sendEmployeeWelcomeEmail(email, token);
  }
}
