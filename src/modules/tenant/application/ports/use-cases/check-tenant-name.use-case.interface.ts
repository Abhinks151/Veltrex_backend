export interface ICheckTenantNameUseCase {
  execute(name: string): Promise<boolean>;
}
