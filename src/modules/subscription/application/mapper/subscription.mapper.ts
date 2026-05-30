import {
  Subscription as PrismaSubscription,
  Plan as PrismaPlan,
} from '@prisma/client';
import { Subscription } from '../../domain/subscription.entity';

export const toSubscriptionMapper = (
  subscription: PrismaSubscription & {
    plan?: PrismaPlan;
    tenant?: { trialUsed: boolean };
  },
): Subscription => {
  return new Subscription(
    subscription.id,
    subscription.tenantId,
    subscription.planId,
    subscription.status as any,
    subscription.currentPeriodStart,
    subscription.currentPeriodEnd,
    subscription.razorpaySubscriptionId,
    subscription.createdAt,
    subscription.updatedAt,
    subscription.tenant?.trialUsed || false,
    subscription.plan
      ? {
          id: subscription.plan.id,
          code: subscription.plan.code,
          name: subscription.plan.name,
          description: subscription.plan.description,
          price: Number(subscription.plan.price),
          currency: subscription.plan.currency,
          durationDays: subscription.plan.durationDays,
        }
      : undefined,
  );
};
