import { PasswordResetToken } from '../../domain/entities/password-reset-token.entity';

export const toDomainPasswordResetToken = (
  token: PasswordResetToken,
): PasswordResetToken => {
  return new PasswordResetToken(
    token.id,
    token.userId,
    token.token,
    token.expiresAt,
    token.createdAt,
  );
};
