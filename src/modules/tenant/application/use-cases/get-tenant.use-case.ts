import { Inject, Injectable } from '@nestjs/common';
import { Tenant } from '../../domain/tenant.entity';
import { IGetTenantUseCase } from '../ports/use-cases/get-tenant.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import { NotFoundError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class GetTenantUseCase implements IGetTenantUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(ownerId: string): Promise<Tenant> {
    const tenant = await this._tenantRepository.findByOwnerId(ownerId);
    if (!tenant) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }
    return tenant;
  }
}
