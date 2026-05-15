import { Inject, Injectable } from '@nestjs/common';
import { IToggleTenantBlockUseCase } from '../ports/use-cases/toggle-tenant-block.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';

@Injectable()
export class ToggleTenantBlockUseCase implements IToggleTenantBlockUseCase {
  constructor(
    @Inject('ITenantQueryService')
    private readonly _tenantQueryService: ITenantQueryService,
  ) {}

  async execute(tenantId: string): Promise<Tenant> {
    const tenant = await this._tenantQueryService.getById(tenantId);

    return this._tenantQueryService.updateBlockStatus(
      tenantId,
      !tenant.isBlocked,
    );
  }
}
