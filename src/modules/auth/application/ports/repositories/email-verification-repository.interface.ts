import { EmailVerificationToken } from '../../../domain/entities/email-verification-token.entity';

export interface IEmailVerificationTokenRepository {
  create(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<EmailVerificationToken>;
  findToken(token: string): Promise<EmailVerificationToken | null>;
  deleteToken(tokenId: string): Promise<void>;
  deleteTokensByUserId(userId: string): Promise<void>;
}
