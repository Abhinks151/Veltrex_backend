import { Inject, Injectable } from '@nestjs/common';
import { IUserLoginUseCase } from '../ports/use-cases/login-user.use-case.interface';
import { AppLogger } from '../../../../shared/common/logger/logger.service';
import { ITokenService } from '../ports/services/token-service.interface';
import { JwtPayload } from '../ports/services/jwt-payload.interface';
import { IUserRepository } from '../ports/repositories/user-repository.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { LoginUserResponseDto } from '../dto/login-response.dto';
import {
  BadRequestError,
  NotFoundError,
} from '../../../../shared/common/errors/domain-errors';
import { IGetTenantByIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-id.use-case.interface';
import { IGetTenantByOwnerIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-owner-id.use-case.interface';

@Injectable()
export class LoginUserUseCase implements IUserLoginUseCase {
  constructor(
    private readonly _logger: AppLogger,

    @Inject('ITokenService')
    private readonly _tokenService: ITokenService,

    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    @Inject('ITenantGetByIdUseCase')
    private readonly _getTenantByIdUseCase: IGetTenantByIdUseCase,

    @Inject('ITenantGetByOwnerIdUseCase')
    private readonly _getTenantByOwnerIdUseCase: IGetTenantByOwnerIdUseCase,
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

    if (user.isBlocked) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
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

    let subdomain: string | undefined;
    let tenantId = user.tenantId;

    if (tenantId) {
      const tenant = await this._getTenantByIdUseCase.execute(tenantId);
      if (tenant?.subdomain) {
        subdomain = tenant.subdomain;
      }
    } else {
      const ownedTenant = await this._getTenantByOwnerIdUseCase.execute(
        user.uuid,
      );
      if (ownedTenant) {
        subdomain = ownedTenant.subdomain || undefined;
        tenantId = ownedTenant.id;
      }
    }

    return {
      access_token,
      refresh_token,
      user: {
        id: user.uuid,
        email: user.email,
        name: user.name,
        role: user.role,
        profileImage: user.profileImage,
        tenantId: tenantId,
        subdomain,
      },
    };
  }
}
