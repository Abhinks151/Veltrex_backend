import { Tenant } from '../../../domain/tenant.entity';

export interface ITenantQueryService {
  getAllTenants(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }>;
  getById(id: string): Promise<Tenant | null>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant>;
  updateName(id: string, name: string): Promise<Tenant>;
  findByOwnerId(ownerId: string): Promise<Tenant | null>;
  checkValidTenant(ownerId: string): Promise<boolean>;
  isTenantBlocked(tenantId: string): Promise<boolean>;
}
