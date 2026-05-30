import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../application/ports/repositories/subscription-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { Subscription } from '../../domain/subscription.entity';
import { toSubscriptionMapper } from '../../application/mapper/subscription.mapper';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { CreateSubscriptionDto } from '../../application/dto/create-subscription.dto';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    subscription: CreateSubscriptionDto,
    ctx?: ITransactionContext,
  ): Promise<Subscription> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const created = await client.subscription.create({
      data: {
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: subscription.startDate,
        currentPeriodEnd: subscription.endDate,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      },
      include: { plan: true, tenant: true },
    });
    return toSubscriptionMapper(created);
  }

  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    const subscription = await this._prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true, tenant: true },
      orderBy: { createdAt: 'desc' },
    });
    return subscription ? toSubscriptionMapper(subscription) : null;
  }

  async findActiveByTenantId(
    tenantId: string,
    ctx?: ITransactionContext,
  ): Promise<Subscription | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const subscription = await client.subscription.findFirst({
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
    await client.subscription.update({
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
          existing.status === SubscriptionStatus.ACTIVE
            ? SubscriptionStatus.CANCELLED
            : SubscriptionStatus.ACTIVE,
      },
      include: { plan: true },
    });
    return toSubscriptionMapper(updated);
  }
}
