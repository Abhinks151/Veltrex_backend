import { Inject, Injectable } from '@nestjs/common';
import { IToggleTenantBlockUseCase } from '../ports/use-cases/toggle-tenant-block.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { IToggleTenantBlockUseCase as ITenantToggleBlockUseCase } from '@/modules/tenant/application/ports/use-cases/toggle-tenant-block.use-case.interface';

@Injectable()
export class ToggleTenantBlockUseCase implements IToggleTenantBlockUseCase {
  constructor(
    @Inject('ITenantToggleBlockUseCase')
    private readonly _tenantToggleBlockUseCase: ITenantToggleBlockUseCase,
  ) {}

  async execute(tenantId: string): Promise<Tenant> {
    return this._tenantToggleBlockUseCase.execute(tenantId);
  }
}
