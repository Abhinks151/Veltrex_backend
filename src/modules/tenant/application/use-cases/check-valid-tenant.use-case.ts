import { Inject, Injectable } from '@nestjs/common';
import { ICheckValidTenantUseCase } from '../ports/use-cases/check-valid-tenant.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class CheckValidTenantUseCase implements ICheckValidTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(ownerId: string): Promise<boolean> {
    const tenant = await this._tenantRepository.findByOwnerId(ownerId);
    if (!tenant || tenant.isBlocked) {
      return false;
    }
    return true;
  }
}
