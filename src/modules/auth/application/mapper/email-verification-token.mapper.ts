import { EmailVerificationToken } from '../../domain/entities/email-verification-token.entity';
// import { EmailVerificationTokenRecord } from "../types/email-verification-token.record";

export const toDomainEmailVerificationToken = (
  token: EmailVerificationToken,
): EmailVerificationToken => {
  return new EmailVerificationToken(
    token.id,
    token.userId,
    token.token,
    token.expiresAt,
    token.createdAt,
  );
};
