import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Tenant } from '../../../domain/tenant.entity';
import { TenantInputDto } from '../../dto/tenant-intput.dto';

export interface ITenantRepository extends IBaseRepository<
  Tenant,
  TenantInputDto
> {
  checkValidTenant(ownerId: string): Promise<Tenant | null>;
  findByOwnerId(ownerId: string): Promise<Tenant | null>;
  findById(id: string): Promise<Tenant | null>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant>;
  findByName(name: string): Promise<Tenant | null>;
  findAll(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }>;
}
