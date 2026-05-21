export interface IRequestPasswordResetUseCase {
  execute(email: string, resetLink?: string): Promise<void>;
}
