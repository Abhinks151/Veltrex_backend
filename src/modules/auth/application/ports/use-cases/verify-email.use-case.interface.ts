export interface IVerifyEmailUseCase {
  execute(token: string): Promise<void>;
}
