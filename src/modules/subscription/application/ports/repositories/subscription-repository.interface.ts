import { Subscription } from '../../../domain/subscription.entity';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';

export interface ISubscriptionRepository {
  create(subscription: CreateSubscriptionDto): Promise<Subscription>;
  findByTenantId(tenantId: string): Promise<Subscription | null>;
  updateStatus(subscriptionId: string): Promise<Subscription | null>;
}
