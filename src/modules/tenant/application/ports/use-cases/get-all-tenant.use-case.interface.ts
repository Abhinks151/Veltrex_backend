import { Tenant } from '../../../domain/tenant.entity';

export interface IGetAllTenantUseCase {
  execute(query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }>;
}
