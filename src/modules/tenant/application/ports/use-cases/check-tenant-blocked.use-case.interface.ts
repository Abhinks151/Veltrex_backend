export interface ICheckTenantBlockedUseCase {
  execute(tenantId: string): Promise<boolean>;
}
