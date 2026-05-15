import { Inject, Injectable } from '@nestjs/common';
import { ICheckTenantNameUseCase } from '../ports/use-cases/check-tenant-name.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';

@Injectable()
export class CheckTenantNameUseCase implements ICheckTenantNameUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(name: string): Promise<boolean> {
    const tenant = await this._tenantRepository.findByName(name);
    return !!tenant;
  }
}
