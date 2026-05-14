import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenUseCase } from '../ports/use-cases/refresh-token.use-case.interface';
import { ITokenService } from '../ports/services/token-service.interface';
import { AppLogger } from '../../../../shared/common/logger/logger.service';
import { JwtPayload } from '../ports/services/jwt-payload.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { UnauthorizedError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _logger: AppLogger,

    @Inject('ITokenService')
    private readonly _tokenService: ITokenService,
  ) {}

  execute(refreshToken: string): {
    access_token: string;
    refresh_token: string;
  } {
    let payload: JwtPayload;

    try {
      payload = this._tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(
        MESSAGE_CONSTANTS.ERROR.INVALID_EXPIRED_REFRESH_TOKEN,
      );
    }

    this._logger.info('Refresh token verified, issuing new tokens', {
      userId: payload.userId,
    });

    const access_token = this._tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      is_verified: payload.is_verified,
    });

    const new_refresh_token = this._tokenService.generateRefreshToken({
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      is_verified: payload.is_verified,
    });

    return { access_token, refresh_token: new_refresh_token };
  }
}
