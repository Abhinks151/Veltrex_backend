import { Inject, Injectable } from '@nestjs/common';
import { IGetLatestPendingPaymentUseCase } from '../ports/use-cases/get-latest-pending-payment.use-case.interface';
import { IPaymentRepository } from '../ports/repositories/payment-repository.interface';
import { Payment } from '../../domain/payment.entity';

@Injectable()
export class GetLatestPendingPaymentUseCase implements IGetLatestPendingPaymentUseCase {
  constructor(
    @Inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,
  ) {}

  async execute(tenantId: string): Promise<Payment | null> {
    return this._paymentRepository.findLatestPendingByTenantId(tenantId);
  }
}
