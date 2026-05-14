import { Tenant } from '../../../domain/tenant.entity';

export interface IGetTenantUseCase {
  execute(ownerId: string): Promise<Tenant>;
}
