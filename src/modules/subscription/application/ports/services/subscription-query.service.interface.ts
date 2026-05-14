import { Subscription } from '../../../domain/subscription.entity';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';

export interface ISubscriptionQueryService {
  create(data: CreateSubscriptionDto): Promise<Subscription>;
}
