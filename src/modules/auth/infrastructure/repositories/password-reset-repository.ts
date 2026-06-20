import { IPasswordResetTokenRepository } from '../../application/ports/repositories/password-reset-repository.interface';
import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';
import { Injectable } from '@nestjs/common';
import { toDomainPasswordResetToken } from '../../application/mapper/password-reset-token.mapper';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';
import {
  PasswordResetToken as RawPasswordResetToken,
  Prisma,
} from '@prisma/client';

@Injectable()
export class PasswordResetTokenRepository
  extends BaseRepository<
    PasswordResetToken,
    Prisma.PasswordResetTokenCreateInput,
    Prisma.PasswordResetTokenUpdateInput,
    RawPasswordResetToken
  >
  implements IPasswordResetTokenRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.PASSWORD_RESET_TOKEN,
      toDomainPasswordResetToken,
      false,
    );
  }

  async createToken(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken> {
    const client = this._prisma;
    await client.passwordResetToken.deleteMany({
      where: {
        userId: userId,
      },
    });

    const newToken = await client.passwordResetToken.create({
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
