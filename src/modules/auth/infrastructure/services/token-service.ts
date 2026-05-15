import { Injectable } from '@nestjs/common';
import { ITokenService } from '../../application/ports/services/token-service.interface';
import { JwtService } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { JwtPayload } from '../../application/ports/services/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TokenService implements ITokenService {
  constructor(
    private readonly _jwt: JwtService,

    private readonly _configService: ConfigService,
  ) {}

  generateAccessToken(payload: JwtPayload & { name: string }): string {
    return this._jwt.sign(payload, {
      expiresIn: (this._configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRES_IN',
      ) || '5m') as StringValue,
    });
  }

  generateRefreshToken(payload: JwtPayload): string {
    return this._jwt.sign(payload, {
      expiresIn: (this._configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRES_IN',
      ) || '7d') as StringValue,
    });
  }

  verifyAccessToken(token: string): JwtPayload {
    return this._jwt.verify(token);
  }

  verifyRefreshToken(token: string): JwtPayload {
    return this._jwt.verify(token);
  }
}
