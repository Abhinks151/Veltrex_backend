import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { IGetAllTenantUseCase } from '../ports/use-cases/get-all-tenant.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class GetAllTenantUseCase implements IGetAllTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(query?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    return this._tenantRepository.findAll(query || {});
  }
}
