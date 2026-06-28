import { Inject, Injectable } from '@nestjs/common';
import { IGetTenantBySubdomainUseCase } from '../ports/use-cases/get-tenant-by-subdomain.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';

@Injectable()
export class GetTenantBySubdomainUseCase implements IGetTenantBySubdomainUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(subdomain: string): Promise<Tenant | null> {
    return this._tenantRepository.findBySubdomain(subdomain);
  }
}
