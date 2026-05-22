export interface IEmailService {
  sendPasswordResetEmail(
    email: string,
    token: string,
    resetLink?: string,
  ): Promise<void>;
  sendVerificationEmail(email: string, token: string): Promise<void>;
  sendEmployeeWelcomeEmail(email: string, token: string): Promise<void>;
}
