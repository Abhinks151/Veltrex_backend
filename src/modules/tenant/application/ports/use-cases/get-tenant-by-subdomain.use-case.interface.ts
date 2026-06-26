import { Tenant } from '@/modules/tenant/domain/tenant.entity';

export interface IGetTenantBySubdomainUseCase {
  execute(subdomain: string): Promise<Tenant | null>;
}
