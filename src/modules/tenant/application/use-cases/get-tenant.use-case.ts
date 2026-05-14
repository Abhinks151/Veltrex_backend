import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { IGetTenantUseCase } from '../ports/use-cases/get-tenant.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class GetTenantUseCase implements IGetTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async execute(ownerId: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findByOwnerId(ownerId);
    return tenant;
  }
}
