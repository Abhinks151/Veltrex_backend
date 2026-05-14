import { Tenant } from '../../../domain/tenant.entity';
import { TenantCreationRequestDto } from '../../dto/create-tenant.dto';

export interface IUpdateTenantUseCase {
  execute(reqDto: TenantCreationRequestDto, tenantId: string): Promise<Tenant>;
}
