import { BadRequestException, Injectable } from '@nestjs/common';
import { ISubscriptionRepository } from '../../application/ports/repositories/subscription-repository.interface';
import { Subscription } from '../../domain/subscription.entity';
import { toSubscriptionMapper } from '../../application/mapper/subscription.mapper';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

import { CreateSubscriptionDto } from '../../application/dto/create-subscription.dto';
import { PlanType } from '@/shared/enums/plan-type.enum';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';

@Injectable()
export class SubscriptionRepository implements ISubscriptionRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(subscription: CreateSubscriptionDto): Promise<Subscription> {
    const created = await this._prisma.subscription.create({
      data: {
        tenantId: subscription.tenantId,
        plan: subscription.plan as PlanType,
        status: subscription.status as SubscriptionStatus,
        startDate: subscription.startDate,
        endDate: subscription.endDate,
        trialUsed: subscription.trialUsed,
        razorpaySubscriptionId: subscription.razorpaySubscriptionId,
      },
    });
    return toSubscriptionMapper(created);
  }

  async findByTenantId(tenantId: string): Promise<Subscription> {
    const subscription = await this._prisma.subscription.findUnique({
      where: { tenantId },
    });
    if (!subscription) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_NOT_FOUND,
      );
    }
    return toSubscriptionMapper(subscription);
  }

  async updateStatus(subscriptionId: string): Promise<Subscription> {
    const existing = await this._prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });
    if (!existing) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_NOT_FOUND,
      );
    }
    const updated = await this._prisma.subscription.update({
      where: { id: subscriptionId },
      data: {
        status:
          existing.status === SubscriptionStatus.ACTIVE
            ? SubscriptionStatus.CANCELLED
            : SubscriptionStatus.ACTIVE,
      },
    });

    if (!updated) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.SUBSCRIPTION_NOT_FOUND,
      );
    }

    return toSubscriptionMapper(updated);
  }
}
