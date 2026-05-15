import { Inject, Injectable } from '@nestjs/common';
import { IUpdateTenantUseCase } from '../ports/use-cases/update-tenant.use-case.interface';
import { TenantCreationRequestDto } from '../dto/create-tenant.dto';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';

@Injectable()
export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(
    reqDto: TenantCreationRequestDto,
    tenantId: string,
  ): Promise<Tenant> {
    const updatedTenant = await this._tenantRepository.update(tenantId, {
      name: reqDto.name,
    });

    return updatedTenant;
  }
}
