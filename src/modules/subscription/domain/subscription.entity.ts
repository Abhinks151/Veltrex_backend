import { PlanType } from '@/shared/enums/plan-type.enum';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

export class Subscription {
  constructor(
    public id: string,
    public tenantId: string,
    public plan: PlanType,
    public status: SubscriptionStatus,
    public startDate: Date,
    public endDate: Date,
    public trialUsed: boolean,
    public razorpaySubscriptionId: string | null,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}
}
