import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { IToggleStatusUseCase } from '../ports/use-cases/toggle-status.use-case.interface';
import { Subscription } from '../../domain/subscription.entity';

@Injectable()
export class ToggleStatusUseCase implements IToggleStatusUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(subscriptionId: string): Promise<Subscription> {
    return await this.subscriptionRepository.updateStatus(subscriptionId);
  }
}
