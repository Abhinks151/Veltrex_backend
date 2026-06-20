import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { Prisma } from '@prisma/client';
import { Subscription } from '../../../domain/subscription.entity';
import { CreateSubscriptionDto } from '../../dto/create-subscription.dto';

export interface ISubscriptionRepository extends IBaseRepository<
  Subscription,
  CreateSubscriptionDto,
  Prisma.SubscriptionUpdateInput
> {
  create(
    subscription: CreateSubscriptionDto,
    ctx?: ITransactionContext,
  ): Promise<Subscription>;
  findByTenantId(tenantId: string): Promise<Subscription | null>;
  findActiveByTenantId(
    tenantId: string,
    ctx?: ITransactionContext,
  ): Promise<Subscription | null>;
  expireSubscription(
    subscriptionId: string,
    ctx?: ITransactionContext,
  ): Promise<void>;
  updateStatus(subscriptionId: string): Promise<Subscription | null>;
}
