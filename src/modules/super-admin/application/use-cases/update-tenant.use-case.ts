import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';
import { IUpdateTenantUseCase } from '../ports/use-cases/update-tenant.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { Inject } from '@nestjs/common';

export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  constructor(
    @Inject('ITenantQueryService')
    private readonly tenantQueryService: ITenantQueryService,
  ) {}

  async execute(tenantId: string, name: string): Promise<Tenant> {
    return this.tenantQueryService.updateName(tenantId, name);
  }
}
