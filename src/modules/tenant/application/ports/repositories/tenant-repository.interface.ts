import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Tenant } from '../../../domain/tenant.entity';
import { TenantInputDto } from '../../dto/tenant-intput.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export interface ITenantRepository extends IBaseRepository<
  Tenant,
  TenantInputDto,
  TenantInputDto
> {
  checkValidTenant(ownerId: string): Promise<Tenant | null>;
  findByOwnerId(ownerId: string): Promise<Tenant | null>;
  findById(id: string): Promise<Tenant | null>;
  updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant>;
  findByName(name: string): Promise<Tenant | null>;
  findBySubdomain(subdomain: string): Promise<Tenant | null>;

  findAll(
    query: PaginationQueryDto,
    ctx?: ITransactionContext,
  ): Promise<{ items: Tenant[]; tenants: Tenant[]; total: number }>;
  markTrialAsUsed(id: string, ctx?: ITransactionContext): Promise<void>;
}
