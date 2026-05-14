import { Inject, Injectable } from '@nestjs/common';
import { ITenantRepository } from './application/ports/repositories/tenant-repository.interface';
import { Tenant } from './domain/tenant.entity';
import { ITenantQueryService } from './application/ports/services/tenant-query.service.interface';

@Injectable()
export class TenantQueryService implements ITenantQueryService {
  constructor(
    @Inject('ITenantRepository')
    private readonly tenantRepository: ITenantRepository,
  ) {}

  async getAllTenants(query: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
  }): Promise<{ tenants: Tenant[]; total: number }> {
    return this.tenantRepository.findAll(query);
  }

  async getById(id: string): Promise<Tenant> {
    return this.tenantRepository.findById(id);
  }

  async updateBlockStatus(id: string, isBlocked: boolean): Promise<Tenant> {
    const tenant = await this.tenantRepository.updateBlockStatus(id, isBlocked);
    return tenant;
  }

  async updateName(id: string, name: string): Promise<Tenant> {
    return this.tenantRepository.update(id, { name });
  }

  async findByOwnerId(ownerId: string): Promise<Tenant> {
    return this.tenantRepository.findByOwnerId(ownerId);
  }
}
