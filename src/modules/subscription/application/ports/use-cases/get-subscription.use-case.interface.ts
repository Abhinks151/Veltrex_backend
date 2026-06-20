import { Subscription } from '../../../domain/subscription.entity';

export interface IGetSubscriptionUseCase {
  execute(userId: string, tenantId?: string): Promise<Subscription>;
}
