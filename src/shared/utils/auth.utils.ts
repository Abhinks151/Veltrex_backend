import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

export function generateRandomPassword(): string {
  return Math.random().toString(36).slice(-10);
}

export function setRefreshTokenCookie(
  res: Response,
  token: string,
  configService: ConfigService,
): void {
  const baseDomain = configService.get<string>('BASE_DOMAIN');
  const isProduction = configService.get<string>('NODE_ENV') === 'production';

  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: isProduction ? 'none' : 'lax',
    secure: isProduction,
    domain: baseDomain ? `.${baseDomain}` : undefined,
    maxAge:
      Number(configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')) ||
      604800000,
  });
}
