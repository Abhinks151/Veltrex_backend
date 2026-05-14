import { Tenant } from '../../domain/tenant.entity';

export const toTenantMapper = (tenant: Tenant): Tenant => {
  return new Tenant(
    tenant.id,
    tenant.name,
    tenant.ownerId,
    tenant.isBlocked,
    tenant.isDeleted,
    tenant.createdAt,
    tenant.updatedAt,
  );
};
