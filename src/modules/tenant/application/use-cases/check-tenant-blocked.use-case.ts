import { Inject, Injectable } from '@nestjs/common';
import { ICheckTenantBlockedUseCase } from '../ports/use-cases/check-tenant-blocked.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class CheckTenantBlockedUseCase implements ICheckTenantBlockedUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(tenantId: string): Promise<boolean> {
    const tenant = await this._tenantRepository.findById(tenantId);
    return tenant?.isBlocked ?? false;
  }
}
