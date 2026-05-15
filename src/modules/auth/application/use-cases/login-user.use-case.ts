import { Inject, Injectable } from '@nestjs/common';
import { IUserLoginUseCase } from '../ports/use-cases/login-user.use-case.interface';
import { AppLogger } from '../../../../shared/common/logger/logger.service';
import { ITokenService } from '../ports/services/token-service.interface';
import { JwtPayload } from '../ports/services/jwt-payload.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { LoginUserResponseDto } from '../dto/login-response.dto';
import { NotFoundError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class LoginUserUseCase implements IUserLoginUseCase {
  constructor(
    private readonly _logger: AppLogger,

    @Inject('ITokenService')
    private readonly _tokenService: ITokenService,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,
  ) {}

  async execute(
    userId: string,
    requestId: string,
  ): Promise<LoginUserResponseDto> {
    this._logger.log('User login attempt', {
      requestId: requestId,
      userId: userId,
    });

    const user = await this._userRepository.findByUuid(userId);
    if (!user) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    const payload: JwtPayload & { name: string } = {
      userId: user.uuid + '',
      email: user.email,
      name: user.name,
      role: user.role,
      is_verified: user.isVerified,
    };

    const access_token = this._tokenService.generateAccessToken(payload);

    const refresh_token = this._tokenService.generateRefreshToken({
      userId: user.uuid + '',
      name: user.name,
      email: user.email,
      role: user.role,
      is_verified: user.isVerified,
    });

    return {
      access_token,
      refresh_token,
      user: {
        id: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }
}
