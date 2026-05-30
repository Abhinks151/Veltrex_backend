import { PaymentProvider, PaymentStatus } from '@prisma/client';

export class Payment {
  id: string;
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
  createdAt: Date;
  constructor(
    id: string,
    tenantId: string,
    subscriptionId: string | null,
    planId: string | null,
    amount: number,
    currency: string,
    provider: PaymentProvider,
    providerPaymentId: string | null,
    providerOrderId: string | null,
    status: PaymentStatus,
    paidAt: Date | null,
    createdAt: Date,
  ) {
    this.id = id;
    this.tenantId = tenantId;
    this.subscriptionId = subscriptionId;
    this.planId = planId;
    this.amount = amount;
    this.currency = currency;
    this.provider = provider;
    this.providerPaymentId = providerPaymentId;
    this.providerOrderId = providerOrderId;
    this.status = status;
    this.paidAt = paidAt;
    this.createdAt = createdAt;
  }
}
