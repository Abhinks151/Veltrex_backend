import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../../application/ports/repositories/payment-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { CreatePaymentDto } from '../../application/dto/create-payment.dto';
import { Payment } from '../../domain/payment.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { toPaymentDomainMapper } from '../mapper/payment.mapper';

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly _prisma: PrismaService) {}

  async create(
    data: CreatePaymentDto,
    ctx?: ITransactionContext,
  ): Promise<Payment> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const payment = await client.payment.create({
      data: {
        tenantId: data.tenantId,
        subscriptionId: data.subscriptionId,
        planId: data.planId,
        amount: data.amount,
        currency: data.currency,
        provider: data.provider,
        providerPaymentId: data.providerPaymentId,
        providerOrderId: data.providerOrderId,
        status: data.status,
        paidAt: data.paidAt,
      },
    });
    return toPaymentDomainMapper(payment);
  }

  async findById(
    id: string,
    ctx?: ITransactionContext,
  ): Promise<Payment | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const payment = await client.payment.findUnique({ where: { id } });
    return payment ? toPaymentDomainMapper(payment) : null;
  }

  async findByProviderOrderId(
    providerOrderId: string,
    ctx?: ITransactionContext,
  ): Promise<Payment | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const payment = await client.payment.findFirst({
      where: { providerOrderId },
    });
    return payment ? toPaymentDomainMapper(payment) : null;
  }

  async update(
    id: string,
    data: Partial<CreatePaymentDto>,
    ctx?: ITransactionContext,
  ): Promise<Payment> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const payment = await client.payment.update({
      where: { id },
      data: { ...data },
    });
    return toPaymentDomainMapper(payment);
  }

  async delete(id: string): Promise<void> {
    await this._prisma.payment.delete({ where: { id } });
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ data: Payment[]; total: number }> {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const skip = (page - 1) * limit;
    const [payments, total] = await Promise.all([
      this._prisma.payment.findMany({ skip, take: limit }),
      this._prisma.payment.count(),
    ]);
    return { data: payments.map(toPaymentDomainMapper), total };
  }
  async findLatestPendingByTenantId(tenantId: string): Promise<Payment | null> {
    const payment = await this._prisma.payment.findFirst({
      where: { tenantId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
    return payment ? toPaymentDomainMapper(payment) : null;
  }
}
