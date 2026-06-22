import { Inject, Injectable } from '@nestjs/common';
import { IGetTenantByOwnerIdUseCase } from '../ports/use-cases/get-tenant-by-owner-id.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';

@Injectable()
export class GetTenantByOwnerIdUseCase implements IGetTenantByOwnerIdUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(ownerId: string): Promise<Tenant | null> {
    return this._tenantRepository.findByOwnerId(ownerId);
  }
}
