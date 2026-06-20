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
  res.cookie('refresh_token', token, {
    httpOnly: true,
    sameSite: 'strict',
    secure: configService.get<string>('NODE_ENV') === 'production',
    maxAge:
      Number(configService.get<string>('JWT_REFRESH_TOKEN_EXPIRES_IN')) ||
      604800000,
  });
}
