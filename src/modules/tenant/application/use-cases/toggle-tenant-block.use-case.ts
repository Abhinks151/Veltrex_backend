import { Inject, Injectable } from '@nestjs/common';
import { IToggleTenantBlockUseCase } from '../ports/use-cases/toggle-tenant-block.use-case.interface';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { NotFoundError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class ToggleTenantBlockUseCase implements IToggleTenantBlockUseCase {
  constructor(
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(id: string): Promise<Tenant> {
    const tenant = await this._tenantRepository.findById(id);
    if (!tenant) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }
    return this._tenantRepository.updateBlockStatus(id, !tenant.isBlocked);
  }
}
