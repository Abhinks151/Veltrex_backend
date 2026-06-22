import { Tenant } from '../../../domain/tenant.entity';

export interface IGetTenantByIdUseCase {
  execute(id: string): Promise<Tenant | null>;
}
