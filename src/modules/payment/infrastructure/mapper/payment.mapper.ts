import { Payment as PrismaPayment } from '@prisma/client';
import { Payment } from '../../domain/payment.entity';

export const toPaymentDomainMapper = (
  prismaPayment: PrismaPayment,
): Payment => {
  return new Payment(
    prismaPayment.id,
    prismaPayment.tenantId,
    prismaPayment.subscriptionId,
    prismaPayment.planId,
    Number(prismaPayment.amount),
    prismaPayment.currency,
    prismaPayment.provider,
    prismaPayment.providerPaymentId,
    prismaPayment.providerOrderId,
    prismaPayment.status,
    prismaPayment.paidAt,
    prismaPayment.createdAt,
  );
};
