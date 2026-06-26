import { Inject, Injectable } from '@nestjs/common';
import { ICheckTenantSubdomainUseCase } from '../ports/use-cases/check-tenant-subdomain.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class CheckTenantSubdomainUseCase implements ICheckTenantSubdomainUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(subdomain: string): Promise<boolean> {
    const tenant = await this._tenantRepository.findBySubdomain(subdomain);
    return !!tenant;
  }
}
