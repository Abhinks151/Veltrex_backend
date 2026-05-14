import { IPasswordResetTokenRepository } from '../../application/ports/repositories/password-reset-repository.interface';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';
import { Injectable } from '@nestjs/common';
import { toDomainPasswordResetToken } from '../../application/mapper/password-reset-token.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class PasswordResetTokenRepository implements IPasswordResetTokenRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    await this._prisma.passwordResetToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    const newToken = await this._prisma.passwordResetToken.create({
      data: {
        userId: userId,
        token: token,
        expiresAt: expiresAt,
      },
    });

    return toDomainPasswordResetToken(newToken);
  }

  async findToken(token: string): Promise<PasswordResetToken | null> {
    const passwordResetToken = await this._prisma.passwordResetToken.findFirst({
      where: {
        token: token,
      },
    });

    if (!passwordResetToken) {
      return null;
    }

    return toDomainPasswordResetToken(passwordResetToken);
  }

  async deleteToken(tokenId: string): Promise<void> {
    await this._prisma.passwordResetToken.delete({
      where: {
        id: tokenId,
      },
    });
  }
}
