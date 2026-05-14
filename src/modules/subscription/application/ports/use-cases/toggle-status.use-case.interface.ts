import { Subscription } from '../../../domain/subscription.entity';

export interface IToggleStatusUseCase {
  execute(subscriptionId: string): Promise<Subscription>;
}
