import { Inject, Injectable } from '@nestjs/common';
// import { v4 as uuidv4 } from 'uuid';
import { ICreateSubscriptionUseCase } from '../ports/use-cases/create-subscription.use-case.interface';
import { Subscription } from '../../domain/subscription.entity';
import { ISubscriptionRepository } from '../ports/repositories/subscription-repository.interface';
import { CreateSubscriptionDto } from '../dto/create-subscription.dto';
// import { CreateSubscriptionDto } from "../../presentation/dto/create-subscription.dto";

@Injectable()
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
  constructor(
    @Inject('ISubscriptionRepository')
    private readonly subscriptionRepository: ISubscriptionRepository,
  ) {}
  async execute(
    userId: string,
    data: CreateSubscriptionDto,
  ): Promise<Subscription> {
    return await this.subscriptionRepository.create(data);
  }
}
