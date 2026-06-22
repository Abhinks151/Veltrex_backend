import { Inject, Injectable } from '@nestjs/common';
import { IGetTenantByIdUseCase } from '../ports/use-cases/get-tenant-by-id.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';

@Injectable()
export class GetTenantByIdUseCase implements IGetTenantByIdUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<Tenant | null> {
    return this._tenantRepository.findById(id);
  }
}
