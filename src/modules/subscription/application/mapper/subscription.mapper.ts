import { PlanType } from '@/shared/enums/plan-type.enum';
import { Subscription } from '../../domain/subscription.entity';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

export const toSubscriptionMapper = (
  subscription: Subscription,
): Subscription => {
  return new Subscription(
    subscription.id,
    subscription.tenantId,
    subscription.plan as unknown as PlanType,
    subscription.status as unknown as SubscriptionStatus,
    subscription.startDate,
    subscription.endDate,
    subscription.trialUsed,
    subscription.razorpaySubscriptionId,
    subscription.createdAt,
    subscription.updatedAt,
  );
};
