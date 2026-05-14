import { PasswordResetToken } from '../../../domain/entities/password-reset-token.entity';

export interface IPasswordResetTokenRepository {
  create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetToken>;
  findToken(token: string): Promise<PasswordResetToken | null>;
  deleteToken(token: string): Promise<void>;
  // findByToken(token: string): Promise<PasswordResetToken | null>;
}
