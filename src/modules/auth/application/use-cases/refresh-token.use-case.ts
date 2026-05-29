import { Inject, Injectable } from '@nestjs/common';
import { IRefreshTokenUseCase } from '../ports/use-cases/refresh-token.use-case.interface';
import { ITokenService } from '../ports/services/token-service.interface';
import { AppLogger } from '../../../../shared/common/logger/logger.service';
import { JwtPayload } from '../ports/services/jwt-payload.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { UnauthorizedError } from '../../../../shared/common/errors/domain-errors';

import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';
import { Role } from '@/shared/enums/roles.enum';

@Injectable()
export class RefreshTokenUseCase implements IRefreshTokenUseCase {
  constructor(
    private readonly _logger: AppLogger,

    @Inject('ITokenService')
    private readonly _tokenService: ITokenService,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ITenantQueryService')
    private readonly _tenantQueryService: ITenantQueryService,
  ) {}

  async execute(refreshToken: string): Promise<{
    access_token: string;
    refresh_token: string;
  }> {
    let payload: JwtPayload;

    try {
      payload = this._tokenService.verifyRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedError(
        MESSAGE_CONSTANTS.ERROR.INVALID_EXPIRED_REFRESH_TOKEN,
      );
    }

    if ((payload.role as Role) !== Role.SUPER_ADMIN) {
      const user = await this._userRepository.findById(payload.userId);
      if (!user) {
        throw new UnauthorizedError(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
      }

      if (user.isBlocked) {
        throw new UnauthorizedError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
      }

      let tenant = null;
      if (user.tenantId) {
        tenant = await this._tenantQueryService.getById(user.tenantId);
      } else {
        tenant = await this._tenantQueryService.findByOwnerId(payload.userId);
      }

      if (tenant) {
        if (tenant.isBlocked) {
          throw new UnauthorizedError(
            MESSAGE_CONSTANTS.ERROR.TENANT_IS_BLOCKED,
          );
        }

        if (user.uuid !== tenant.ownerId) {
          const owner = await this._userRepository.findById(tenant.ownerId);
          if (owner && owner.isBlocked) {
            throw new UnauthorizedError(
              MESSAGE_CONSTANTS.ERROR.TENANT_IS_BLOCKED,
            );
          }
        }
      }

      if (!tenant && (payload.role as Role) !== Role.ADMIN) {
        throw new UnauthorizedError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
      }
    }

    this._logger.log('Refresh token verified, issuing new tokens', {
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
