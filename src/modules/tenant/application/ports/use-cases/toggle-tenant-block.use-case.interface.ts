import { Tenant } from '../../../domain/tenant.entity';

export interface IToggleTenantBlockUseCase {
  execute(id: string): Promise<Tenant>;
}
