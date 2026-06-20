import { Injectable } from '@nestjs/common';
import { IEmailVerificationTokenRepository } from '../../application/ports/repositories/email-verification-repository.interface';
import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
import { toDomainEmailVerificationToken } from '../../application/mapper/email-verification-token.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import {
  EmailVerificationToken as RawEmailVerificationToken,
  Prisma,
} from '@prisma/client';

@Injectable()
export class EmailVerificationTokenRepository
  extends BaseRepository<
    EmailVerificationToken,
    Prisma.EmailVerificationTokenCreateInput,
    Prisma.EmailVerificationTokenUpdateInput,
    RawEmailVerificationToken
  >
  implements IEmailVerificationTokenRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.EMAIL_VERIFICATION_TOKEN,
      toDomainEmailVerificationToken,
      false,
    );
  }

  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<EmailVerificationToken> {
    const client = this._prisma;
    await client.emailVerificationToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    const newToken = await client.emailVerificationToken.create({
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
