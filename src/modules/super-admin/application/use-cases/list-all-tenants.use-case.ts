import { Inject, Injectable } from '@nestjs/common';
import { IListAllTenantsUseCase } from '../ports/use-cases/list-all-tenants.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { IGetAllTenantUseCase } from '@/modules/tenant/application/ports/use-cases/get-all-tenant.use-case.interface';

@Injectable()
export class ListAllTenantsUseCase implements IListAllTenantsUseCase {
  constructor(
    @Inject('ITenantGetAllUseCase')
    private readonly _getAllTenantUseCase: IGetAllTenantUseCase,
  ) {}

  async execute(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    return this._getAllTenantUseCase.execute(query);
  }
}
