import { Injectable } from '@nestjs/common';
import { IPasswordResetTokenRepository } from '../../application/ports/repositories/password-reset-repository.interface';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';
import { RedisService } from '@/shared/infrastructure/redis/redis.service';
import { REDIS_KEYS } from '@/shared/infrastructure/redis/redis.constants';

@Injectable()
export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  private readonly TOKEN_KEY = REDIS_KEYS.AUTH.PASSWORD_RESET.TOKEN;
  private readonly USER_KEY = REDIS_KEYS.AUTH.PASSWORD_RESET.USER;

  constructor(private readonly _redis: RedisService) {}

  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    const ttl = Math.max(
      1,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    );

    // Invalidate any existing token
    const existingToken = await this._redis.get(this.USER_KEY + userId);
    if (existingToken) {
      await this._redis.del(this.TOKEN_KEY + existingToken);
    }

    await this._redis.set(this.TOKEN_KEY + token, userId, ttl);
    await this._redis.set(this.USER_KEY + userId, token, ttl);

    return new PasswordResetToken(token, userId, token, expiresAt, new Date());
  }

  async findToken(token: string): Promise<PasswordResetToken | null> {
    const userId = await this._redis.get(this.TOKEN_KEY + token);
    if (!userId) return null;

    return new PasswordResetToken(
      token,
      userId,
      token,
      new Date(Date.now() + 3600_000),
      new Date(),
    );
  }

  async deleteToken(token: string): Promise<void> {
    const userId = await this._redis.get(this.TOKEN_KEY + token);
    await this._redis.del(this.TOKEN_KEY + token);
    if (userId) {
      await this._redis.del(this.USER_KEY + userId);
    }
  }
}
