export interface IRequestPasswordResetUseCase {
  execute(email: string): Promise<void>;
}
