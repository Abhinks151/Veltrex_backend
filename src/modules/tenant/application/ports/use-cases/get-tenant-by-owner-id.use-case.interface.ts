import { Tenant } from '../../../domain/tenant.entity';

export interface IGetTenantByOwnerIdUseCase {
  execute(ownerId: string): Promise<Tenant | null>;
}
