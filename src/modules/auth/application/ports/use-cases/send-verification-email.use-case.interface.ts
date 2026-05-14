export interface ISendVerificationEmailUseCase {
  execute(email: string): Promise<void>;
}
