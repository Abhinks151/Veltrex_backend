import { Inject, Injectable } from '@nestjs/common';
import { IGetSubscriptionByTenantIdUseCase } from '../ports/use-cases/get-subscription-by-tenant-id.use-case.interface';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { Subscription } from '../../domain/subscription.entity';

@Injectable()
export class GetSubscriptionByTenantIdUseCase implements IGetSubscriptionByTenantIdUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(tenantId: string): Promise<Subscription | null> {
    return await this._subscriptionRepository.findByTenantId(tenantId);
  }
}
