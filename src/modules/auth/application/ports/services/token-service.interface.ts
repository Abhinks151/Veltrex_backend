import { JwtPayload } from './jwt-payload.interface';

export interface ITokenService {
  generateAccessToken(payload: JwtPayload & { name: string }): string;
  generateRefreshToken(payload: JwtPayload): string;
  verifyAccessToken(token: string): JwtPayload;
  verifyRefreshToken(token: string): JwtPayload;
}
