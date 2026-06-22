import { Subscription } from '../../../domain/subscription.entity';

export interface IGetSubscriptionByTenantIdUseCase {
  execute(tenantId: string): Promise<Subscription | null>;
}
