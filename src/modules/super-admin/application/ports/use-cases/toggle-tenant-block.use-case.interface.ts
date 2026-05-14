import { Tenant } from '@/modules/tenant/domain/tenant.entity';

export interface IToggleTenantBlockUseCase {
  execute(tenantId: string): Promise<Tenant>;
}
