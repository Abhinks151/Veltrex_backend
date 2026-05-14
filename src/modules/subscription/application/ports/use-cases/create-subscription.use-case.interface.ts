import { Subscription } from '../../../domain/subscription.entity';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';

export interface ICreateSubscriptionUseCase {
  execute(userId: string, data: CreateSubscriptionDto): Promise<Subscription>;
}
