import { PaymentProvider, PaymentStatus } from '@prisma/client';

export interface CreatePaymentDto {
  tenantId: string;
  subscriptionId?: string | null;
  planId?: string | null;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  providerPaymentId?: string | null;
  providerOrderId?: string | null;
  status: PaymentStatus;
  paidAt?: Date | null;
}
