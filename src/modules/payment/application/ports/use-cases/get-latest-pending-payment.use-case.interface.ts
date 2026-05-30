import { Payment } from '../../../domain/payment.entity';

export interface IGetLatestPendingPaymentUseCase {
  execute(tenantId: string): Promise<Payment | null>;
}
