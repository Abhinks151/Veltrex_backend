import { Injectable } from '@nestjs/common';
import { IEmailVerificationTokenRepository } from '../../application/ports/repositories/email-verification-repository.interface';
import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
import { toDomainEmailVerificationToken } from '../../application/mapper/email-verification-token.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class EmailVerificationTokenRepository implements IEmailVerificationTokenRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<EmailVerificationToken> {
    await this._prisma.emailVerificationToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    const newToken = await this._prisma.emailVerificationToken.create({
      data: {
        userId: userId,
        token: token,
        expiresAt: expiresAt,
      },
    });

    return toDomainEmailVerificationToken(newToken);
  }

  async findToken(token: string): Promise<EmailVerificationToken | null> {
    const verificationToken =
      await this._prisma.emailVerificationToken.findUnique({
        where: { token: token },
      });

    if (!verificationToken) {
      return null;
    }

    return toDomainEmailVerificationToken(verificationToken);
  }

  async deleteToken(tokenId: string): Promise<void> {
    await this._prisma.emailVerificationToken.delete({
      where: { id: tokenId },
    });
  }

  async deleteTokensByUserId(userId: string): Promise<void> {
    await this._prisma.emailVerificationToken.deleteMany({
      where: { userId: userId },
    });
  }
}
