import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../application/ports/repositories/subscription-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { Subscription } from '../../domain/subscription.entity';
import { toSubscriptionMapper } from '../../application/mapper/subscription.mapper';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { CreateSubscriptionDto } from '../../application/dto/create-subscription.dto';
import {
  Subscription as PrismaSubscription,
  Plan as PrismaPlan,
  Prisma,
} from '@prisma/client';
import { BadRequestError } from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

export type RawSubscription = PrismaSubscription & {
  plan?: PrismaPlan;
  tenant?: { trialUsed: boolean };
};

@Injectable()
export class SubscriptionRepository
  extends BaseRepository<
    Subscription,
    CreateSubscriptionDto,
    Prisma.SubscriptionUpdateInput,
    RawSubscription
  >
  implements ISubscriptionRepository
{
  constructor(prisma: PrismaService) {
    super(
      prisma,
      RepositoryModelNames.SUBSCRIPTION,
      toSubscriptionMapper,
      false,
    );
  }

  async create(
    subscription: CreateSubscriptionDto,
    ctx?: ITransactionContext,
  ): Promise<Subscription> {
    try {
      const data: Prisma.SubscriptionCreateInput = {
        tenant: { connect: { id: subscription.tenantId } },
        plan: { connect: { id: subscription.planId } },
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: subscription.startDate,
        currentPeriodEnd: subscription.endDate,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      };

      return await super.create(data as unknown as CreateSubscriptionDto, ctx, {
        plan: true,
        tenant: true,
      });
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    const subscription = await this._prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true, tenant: true },
      orderBy: { createdAt: 'desc' },
    });
    return subscription
      ? toSubscriptionMapper(subscription as RawSubscription)
      : null;
  }

  async findActiveByTenantId(
    tenantId: string,
    ctx?: ITransactionContext,
  ): Promise<Subscription | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    const subscription = await model.findFirst({
      where: { tenantId, status: SubscriptionStatus.ACTIVE },
      include: { plan: true, tenant: true },
    });
    return subscription ? toSubscriptionMapper(subscription) : null;
  }

  async expireSubscription(
    subscriptionId: string,
    ctx?: ITransactionContext,
  ): Promise<void> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    await model.update({
      where: { id: subscriptionId },
      data: { status: SubscriptionStatus.EXPIRED },
    });
  }

  async updateStatus(subscriptionId: string): Promise<Subscription | null> {
    const existing = await this._prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!existing) return null;
    const updated = await this._prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status:
          (existing.status as unknown as SubscriptionStatus) ===
          SubscriptionStatus.ACTIVE
            ? SubscriptionStatus.CANCELLED
            : SubscriptionStatus.ACTIVE,
      },
      include: { plan: true },
    });
    return toSubscriptionMapper(updated as RawSubscription);
  }
}
