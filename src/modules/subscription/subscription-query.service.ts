import { Inject, Injectable } from '@nestjs/common';
import { Subscription } from './domain/subscription.entity';
import { ISubscriptionQueryService } from './application/ports/services/subscription-query.service.interface';
import { ISubscriptionRepository } from './application/ports/repositories/subscription-repository.interface';
import { CreateSubscriptionDto } from './application/dto/create-subscription.dto';

@Injectable()
export class SubscriptionQueryService implements ISubscriptionQueryService {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  create(data: CreateSubscriptionDto): Promise<Subscription> {
    return this._subscriptionRepository.create(data);
  }
}
