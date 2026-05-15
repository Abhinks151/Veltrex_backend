import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';
import { IUpdateTenantUseCase } from '../ports/use-cases/update-tenant.use-case.interface';
import { Tenant } from '@/modules/tenant/domain/tenant.entity';
import { Inject, Injectable } from '@nestjs/common';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import {
  ConflictError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { ITenantRepository } from '@/modules/tenant/application/ports/repositories/tenant-repository.interface';

@Injectable()
export class UpdateTenantUseCase implements IUpdateTenantUseCase {
  constructor(
    @Inject('ITenantQueryService')
    private readonly _tenantQueryService: ITenantQueryService,
    @Inject('ITenantRepository')
    private readonly _tenantRepository: ITenantRepository,
  ) {}

  async execute(tenantId: string, name: string): Promise<Tenant> {
    const tenantExists = await this._tenantQueryService.getById(tenantId);
    if (!tenantExists) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const nameTaken = await this._tenantRepository.findByName(name);
    if (nameTaken && nameTaken.id !== tenantId) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TENANT_NAME_TAKEN);
    }

    return this._tenantQueryService.updateName(tenantId, name);
  }
}
