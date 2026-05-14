import { Tenant } from '../../../domain/tenant.entity';
import { TenantCreationRequestDto } from '../../dto/create-tenant.dto';

export interface ICreateTenantUseCase {
  execute(reqDto: TenantCreationRequestDto, ownerId: string): Promise<Tenant>;
}
