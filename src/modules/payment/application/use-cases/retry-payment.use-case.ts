import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IRetryPaymentUseCase } from '../ports/use-cases/retry-payment.use-case.interface';
import { CreatePaymentOrderResponseDto } from '../dto/create-order-payment.reponse.dto';
import { IPaymentGateway } from '../ports/services/payment-gateway.interface';
import { IPaymentRepository } from '../ports/repositories/payment-repository.interface';
import { IGetPlanByIdUseCase } from '@/modules/super-admin/application/ports/use-cases/get-plan-by-id.use-case.interface';
import { PaymentStatus, PaymentProvider } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class RetryPaymentUseCase implements IRetryPaymentUseCase {
  constructor(
    @Inject('IPaymentGateway')
    private readonly _paymentGateway: IPaymentGateway,
    @Inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,
    @Inject('ISuperAdminGetPlanByIdUseCase')
    private readonly _getPlanByIdUseCase: IGetPlanByIdUseCase,
  ) {}

  async execute(paymentId: string): Promise<CreatePaymentOrderResponseDto> {
    const originalPayment = await this._paymentRepository.findById(paymentId);
    if (!originalPayment)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PAYMENT_NOT_FOUND);

    if (originalPayment.status === PaymentStatus.SUCCESS) {
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.PAYMENT_ALREADY_SUCCEEDED,
      );
    }

    if (!originalPayment.planId) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.PAYMENT_NO_PLAN);
    }

    const plan = await this._getPlanByIdUseCase.execute(originalPayment.planId);
    if (!plan)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PLAN_NOT_FOUND);

    const receipt = `r_retry_${uuidv4().substring(0, 18)}`;
    const amountInSmallestUnit = Number(plan.price) * 100;

    const order = await this._paymentGateway.createOrder(
      amountInSmallestUnit,
      plan.currency,
      receipt,
    );

    const newPayment = await this._paymentRepository.create({
      tenantId: originalPayment.tenantId,
      planId: plan.id,
      amount: Number(plan.price),
      currency: plan.currency,
      provider: PaymentProvider.RAZORPAY,
      providerOrderId: order.orderId,
      status: PaymentStatus.PENDING,
    });

    return {
      paymentId: newPayment.id,
      orderId: order.orderId,
      amount: Number(plan.price),
      currency: plan.currency,
    };
  }
}
