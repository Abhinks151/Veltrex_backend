import { Inject, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { IToggleStatusUseCase } from '../ports/use-cases/toggle-status.use-case.interface';
import { Subscription } from '../../domain/subscription.entity';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BadRequestError } from '../../../../shared/common/errors/domain-errors';

@Injectable()
export class ToggleStatusUseCase implements IToggleStatusUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(subscriptionId: string): Promise<Subscription> {
    const subscription =
      await this._subscriptionRepository.updateStatus(subscriptionId);
    if (!subscription) {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_NOT_FOUND);
    }
    return subscription;
  }
}
