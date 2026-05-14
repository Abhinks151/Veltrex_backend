import { Inject, Injectable } from '@nestjs/common';
import { IGetSubscriptionUseCase } from '../ports/use-cases/get-subscription.use-case.interface';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { Subscription } from '../../domain/subscription.entity';
import { ITenantQueryService } from '@/modules/tenant/application/ports/services/tenant-query.service.interface';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class GetSubscriptionUseCase implements IGetSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,

    @Inject('ITenantQueryService')
    private readonly tenantQueryService: ITenantQueryService,
  ) {}

  async execute(userId: string): Promise<Subscription> {
    const tenant = await this.tenantQueryService.findByOwnerId(userId);
    if (!tenant) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.TENANT_NOT_FOUND);
    }

    const subscription = await this.subscriptionRepository.findByTenantId(
      tenant.id,
    );
    return subscription;
  }
}
