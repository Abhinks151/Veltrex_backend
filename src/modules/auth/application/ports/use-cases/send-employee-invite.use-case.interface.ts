export interface ISendEmployeeInviteUseCase {
  execute(email: string): Promise<void>;
}
