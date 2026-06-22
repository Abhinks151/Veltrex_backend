import { IUpdateTenantUseCase as ITenantUpdateUseCase } from '@/modules/tenant/application/ports/use-cases/update-tenant.use-case.interface';
import { IUpdateTenantUseCase } from '../ports/use-cases/update-tenant.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  constructor(
    @Inject('ITenantUpdateUseCase')
    private readonly _tenantUpdateUseCase: ITenantUpdateUseCase,
  ) {}

  async execute(tenantId: string, name: string): Promise<Tenant> {
    return this._tenantUpdateUseCase.execute({ name, ownerId: '' }, tenantId);
  }
}
