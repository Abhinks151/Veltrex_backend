import { Inject, Injectable } from '@nestjs/common';
import { IListAllTenantsUseCase } from '../ports/use-cases/list-all-tenants.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';

@Injectable()
export class ListAllTenantsUseCase implements IListAllTenantsUseCase {
  constructor(
    @Inject('ITenantQueryService')
    private readonly tenantQueryService: ITenantQueryService,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    return this.tenantQueryService.getAllTenants(query);
  }
}
