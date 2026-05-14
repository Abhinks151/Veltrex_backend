export interface CreateSubscriptionDto {
  tenantId: string;
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date;
  trialUsed: boolean;
  razorpaySubscriptionId: string;
}
