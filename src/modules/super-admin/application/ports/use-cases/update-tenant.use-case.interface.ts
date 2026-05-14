import { Tenant } from '@/modules/tenant/domain/tenant.entity';

export interface IUpdateTenantUseCase {
  execute(tenantId: string, name: string): Promise<Tenant>;
}
