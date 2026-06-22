export interface ICheckValidTenantUseCase {
  execute(ownerId: string): Promise<boolean>;
}
