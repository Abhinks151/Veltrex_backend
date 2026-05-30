import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { Payment } from '@/modules/payment/domain/payment.entity';
import { CreatePaymentDto } from '../../dto/create-payment.dto';

export interface IPaymentRepository extends IBaseRepository<
  Payment,
  CreatePaymentDto,
  Partial<CreatePaymentDto>
> {
  findById(id: string, ctx?: ITransactionContext): Promise<Payment | null>;
  findByProviderOrderId(
    providerOrderId: string,
    ctx?: ITransactionContext,
  ): Promise<Payment | null>;
  findLatestPendingByTenantId(tenantId: string): Promise<Payment | null>;
}
