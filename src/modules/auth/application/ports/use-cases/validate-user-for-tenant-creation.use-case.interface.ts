export interface IValidateUserForTenantCreationUseCase {
  execute(userId: string): Promise<boolean>;
}
