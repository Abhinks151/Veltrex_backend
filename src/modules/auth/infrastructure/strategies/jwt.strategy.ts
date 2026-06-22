import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { IUserRepository } from '../../application/ports/repositories/user-repository.interface';
import { JwtPayload } from '../../application/ports/services/jwt-payload.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { IGetTenantByIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-id.use-case.interface';
import { IGetTenantByOwnerIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-owner-id.use-case.interface';
import { ValidatedUserDto } from '../../application/dto/jwt-strategy.dto';
import { ConfigService } from '@nestjs/config';
import { Role } from '@/shared/enums/roles.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @Inject('IUserRepository')
    private readonly _userRepository: IUserRepository,

    private readonly _configService: ConfigService,
    private readonly _moduleRef: ModuleRef,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        _configService.get<string>('JWT_SECRET_KEY') ||
        'this is a super hard secret',
    });
  }

  async validate(payload: JwtPayload): Promise<ValidatedUserDto> {
    const user = await this._userRepository.findByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_NOT_FOUND);
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.USER_IS_BLOCKED);
    }

    if ((payload.role as Role) === Role.SUPER_ADMIN) {
      return {
        userId: payload.userId,
        id: payload.userId,
        name: user.name,
        uuid: payload.userId,
        email: payload.email,
        role: payload.role as Role,
        is_verified: user.isVerified,
        profileImage: user.profileImage,
      };
    }

    const getTenantByIdUseCase = this._moduleRef.get<IGetTenantByIdUseCase>(
      'ITenantGetByIdUseCase',
      { strict: false },
    );

    const getTenantByOwnerIdUseCase =
      this._moduleRef.get<IGetTenantByOwnerIdUseCase>(
        'ITenantGetByOwnerIdUseCase',
        { strict: false },
      );

    let tenant = null;
    if (user.tenantId) {
      tenant = await getTenantByIdUseCase.execute(user.tenantId);
    } else {
      tenant = await getTenantByOwnerIdUseCase.execute(payload.userId);
    }

    if (tenant) {
      if (tenant.isBlocked) {
        throw new UnauthorizedException(
          MESSAGE_CONSTANTS.ERROR.TENANT_IS_BLOCKED,
        );
      }

      if (user.uuid !== tenant.ownerId) {
        const owner = await this._userRepository.findById(tenant.ownerId);
        if (owner && owner.isBlocked) {
          throw new UnauthorizedException(
            MESSAGE_CONSTANTS.ERROR.TENANT_IS_BLOCKED,
          );
        }
      }
    }

    if (!tenant && (payload.role as Role) !== Role.ADMIN) {
      throw new UnauthorizedException(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    return {
      userId: payload.userId,
      id: payload.userId,
      name: user.name,
      uuid: payload.userId,
      email: payload.email,
      role: payload.role as Role,
      is_verified: user.isVerified,
      profileImage: user.profileImage,
      tenantId: tenant?.id,
    };
  }
}
