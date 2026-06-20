import { Injectable } from '@nestjs/common';
import { IPaymentRepository } from '../../application/ports/repositories/payment-repository.interface';
import { ITransactionContext } from '@/shared/application/ports/transaction-context.interface';
import { PrismaService } from '@/shared/infrastructure/prisma/prisma.service';
import { resolvePrismaClient } from '@/shared/infrastructure/prisma/resolve-prisma-client';
import { CreatePaymentDto } from '../../application/dto/create-payment.dto';
import { Payment } from '../../domain/payment.entity';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';
import { toPaymentDomainMapper } from '../mapper/payment.mapper';
import {
  BadRequestError,
  NotFoundError,
} from '@/shared/common/errors/domain-errors';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';
import { BaseRepository } from '@/shared/infrastructure/repository/base-repository';
import { Payment as PrismaPayment, Prisma } from '@prisma/client';
import { RepositoryModelNames } from '@/shared/enums/repository-model-names.constants';

@Injectable()
export class PaymentRepository
  extends BaseRepository<
    Payment,
    CreatePaymentDto,
    Prisma.PaymentUpdateInput,
    PrismaPayment
  >
  implements IPaymentRepository
{
  constructor(prisma: PrismaService) {
    super(prisma, RepositoryModelNames.PAYMENT, toPaymentDomainMapper, false);
  }

  async create(
    data: CreatePaymentDto,
    ctx?: ITransactionContext,
  ): Promise<Payment> {
    try {
      return await super.create(data, ctx);
    } catch {
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async findByProviderOrderId(
    providerOrderId: string,
    ctx?: ITransactionContext,
  ): Promise<Payment | null> {
    const client = resolvePrismaClient(this._prisma, ctx);
    const model = this.getModel(client);
    const payment = await model.findFirst({
      where: { providerOrderId },
    });
    return payment ? this._mapper(payment) : null;
  }

  async delete(id: string): Promise<Payment> {
    try {
      const response = await this._prisma.payment.delete({ where: { id } });
      return this._mapper(response);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundError(MESSAGE_CONSTANTS.ERROR.PAYMENT_NOT_FOUND);
      }
      throw new BadRequestError(MESSAGE_CONSTANTS.ERROR.INTERNAL_SERVER_ERROR);
    }
  }

  async findAll(
    query: PaginationQueryDto,
  ): Promise<{ items: Payment[]; data: Payment[]; total: number }> {
    const { items, total } = await super.findAll(query);

    return {
      items,
      data: items,
      total,
    };
  }

  async findLatestPendingByTenantId(tenantId: string): Promise<Payment | null> {
    const payment = await this._prisma.payment.findFirst({
      where: { tenantId, status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      include: { plan: true },
    });
    return payment ? this._mapper(payment as PrismaPayment) : null;
  }
}
