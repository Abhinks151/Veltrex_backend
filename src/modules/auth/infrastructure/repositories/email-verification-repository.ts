import { Injectable } from '@nestjs/common';
import { IEmailVerificationTokenRepository } from '../../application/ports/repositories/email-verification-repository.interface';
import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
import { RedisService } from '@/shared/infrastructure/redis/redis.service';
import { REDIS_KEYS } from '@/shared/infrastructure/redis/redis.constants';
import { toDomainEmailVerificationToken } from '../../application/mapper/email-verification-token.mapper';

@Injectable()
export class EmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
  private readonly TOKEN_KEY = REDIS_KEYS.AUTH.EMAIL_VERIFY.TOKEN;
  private readonly USER_KEY = REDIS_KEYS.AUTH.EMAIL_VERIFY.USER;

  constructor(private readonly _redis: RedisService) {}

  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<EmailVerificationToken> {
    const ttl = Math.max(
      1,
      Math.floor((expiresAt.getTime() - Date.now()) / 1000),
    );

    const existingToken = await this._redis.get(this.USER_KEY + userId);
    if (existingToken) {
      await this._redis.del(this.TOKEN_KEY + existingToken);
    }

    await this._redis.set(this.TOKEN_KEY + token, userId, ttl);
    await this._redis.set(this.USER_KEY + userId, token, ttl);

    // return new EmailVerificationToken(
    //   token,
    //   userId,
    //   token,
    //   expiresAt,
    //   new Date(),
    // );

    return toDomainEmailVerificationToken({
      id: token,
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    });
  }

  async findToken(token: string): Promise<EmailVerificationToken | null> {
    const userId = await this._redis.get(this.TOKEN_KEY + token);
    if (!userId) return null;

    return toDomainEmailVerificationToken({
      id: token,
      userId,
      token,
      expiresAt: new Date(Date.now() + 3600_000),
      createdAt: new Date(),
    });
  }

  async deleteToken(token: string): Promise<void> {
    const userId = await this._redis.get(this.TOKEN_KEY + token);
    await this._redis.del(this.TOKEN_KEY + token);
    if (userId) {
      await this._redis.del(this.USER_KEY + userId);
    }
  }

  async deleteTokensByUserId(userId: string): Promise<void> {
    const token = await this._redis.get(this.USER_KEY + userId);
    await this._redis.del(this.USER_KEY + userId);
    if (token) {
      await this._redis.del(this.TOKEN_KEY + token);
    }
  }
}
