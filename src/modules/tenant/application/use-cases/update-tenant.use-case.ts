import { Inject, Injectable } from '@nestjs/common';
import { IUpdateTenantUseCase } from '../ports/use-cases/update-tenant.use-case.interface';
import { TenantCreationRequestDto } from '../dto/create-tenant.dto';
import { ITenantRepository } from '../ports/repositories/tenant-repository.interface';
import { Tenant } from '../../domain/tenant.entity';
import { MESSAGE_CONSTANTS } from '../../../../shared/enums/messageConstants';
import {
  ConflictError,
  NotFoundError,
} from '../../../../shared/common/errors/domain-errors';

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
    const tenantExists = await this._tenantRepository.findById(tenantId);
    if (!tenantExists) {
      throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const nameTaken = await this._tenantRepository.findByName(reqDto.name);
    if (nameTaken && nameTaken.id !== tenantId) {
      throw new ConflictError(MESSAGE_CONSTANTS.ERROR.TENANT_NAME_TAKEN);
    }

    const updatedTenant = await this._tenantRepository.update(tenantId, {
      name: reqDto.name,
    });

    return updatedTenant;
  }
}
