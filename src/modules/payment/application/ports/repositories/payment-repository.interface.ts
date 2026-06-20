import { IBaseRepository } from '@/shared/infrastructure/repository/base-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { Payment } from '@/modules/payment/domain/payment.entity';
import { CreatePaymentDto } from '../../dto/create-payment.dto';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { Prisma } from '@prisma/client';

export interface IPaymentRepository extends IBaseRepository<
  Payment,
  CreatePaymentDto,
  Prisma.PaymentUpdateInput
> {
  findById(id: string, ctx?: ITransactionContext): Promise<Payment | null>;
  findByProviderOrderId(
    providerOrderId: string,
    ctx?: ITransactionContext,
  ): Promise<Payment | null>;
  findLatestPendingByTenantId(tenantId: string): Promise<Payment | null>;
  findAll(
    query: PaginationQueryDto,
  ): Promise<{ items: Payment[]; data: Payment[]; total: number }>;
  delete(id: string): Promise<Payment>;
}
