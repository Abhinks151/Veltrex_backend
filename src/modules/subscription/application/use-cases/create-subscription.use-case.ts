import { Inject, Injectable } from '@nestjs/common';
import { ICreateSubscriptionUseCase } from '../ports/use-cases/create-subscription.use-case.interface';
import { Subscription } from '../../domain/subscription.entity';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';

@Injectable()
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}
  async execute(
    userId: string,
    data: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return await this._subscriptionRepository.create(data);
  }
}
