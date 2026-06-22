import { Inject, Injectable } from '@nestjs/common';
import { IGetSubscriptionUseCase } from '../ports/use-cases/get-subscription.use-case.interface';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { Subscription } from '../../domain/subscription.entity';
import { IGetTenantByOwnerIdUseCase } from '@/modules/tenant/application/ports/use-cases/get-tenant-by-owner-id.use-case.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,

    @Inject('ITenantGetByOwnerIdUseCase')
    private readonly _getTenantByOwnerIdUseCase: IGetTenantByOwnerIdUseCase,
  ) {}

  async execute(userId: string, tenantId?: string): Promise<Subscription> {
    let finalTenantId = tenantId;

    if (!finalTenantId) {
      const tenant = await this._getTenantByOwnerIdUseCase.execute(userId);
      if (!tenant) {
        throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
      }
      finalTenantId = tenant.id;
    }

    const subscription =
      await this._subscriptionRepository.findByTenantId(finalTenantId);
    if (!subscription) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_NOT_FOUND);
    }

    return subscription;
  }
}
