export interface ICheckTenantSubdomainUseCase {
  execute(subdomain: string): Promise<boolean>;
}
