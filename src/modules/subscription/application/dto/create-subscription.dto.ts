export interface CreateSubscriptionDto {
  tenantId: string;
  planId: string;
  status: string;
  startDate: Date;
  endDate: Date;
  trialUsed?: boolean;
  razorpaySubscriptionId?: string;
}
