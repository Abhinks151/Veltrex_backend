import { Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../application/ports/repositories/subscription-repository.interface';
import { Subscription } from '../../domain/subscription.entity';
import { toSubscriptionMapper } from '../../application/mapper/subscription.mapper';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

import { CreateSubscriptionDto } from '../../application/dto/create-subscription.dto';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(subscription: CreateSubscriptionDto): Promise<Subscription> {
    const created = await this._prisma.subscription.create({
      data: {
        tenantId: subscription.tenantId,
        planId: subscription.planId,
        status: subscription.status as SubscriptionStatus,
        currentPeriodStart: subscription.startDate,
        currentPeriodEnd: subscription.endDate,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      },
      include: { plan: true },
    });
    return toSubscriptionMapper(created);
  }

  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    const subscription = await this._prisma.subscription.findFirst({
      where: { tenantId },
      include: { plan: true },
    });
    if (!subscription) {
      return null;
    }
    return toSubscriptionMapper(subscription);
  }

  async updateStatus(subscriptionId: string): Promise<Subscription | null> {
    const existing = await this._prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!existing) {
      return null;
    }
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
