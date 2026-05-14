import { Subscription } from '../../../domain/subscription.entity';

export interface IGetSubscriptionUseCase {
  execute(userId: string): Promise<Subscription>;
}
