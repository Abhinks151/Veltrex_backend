import { Tenant } from '@/modules/tenant/domain/tenant.entity';

export interface IListAllTenantsUseCase {
  execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }>;
}
