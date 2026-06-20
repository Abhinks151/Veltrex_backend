import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';

export interface PlanInfo {
  id: string;
  code: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  durationDays: number | null;
}

export class Subscription {
  constructor(
    public id: string,
    public tenantId: string,
    public planId: string,
    public status: SubscriptionStatus,
    public startDate: Date,
    public endDate: Date,
    public razorpaySubscriptionId: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public trialUsed: boolean,
    public plan?: PlanInfo,
  ) {}
}
