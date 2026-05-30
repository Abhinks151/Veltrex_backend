import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ICreatePaymentOrderUseCase } from '../ports/use-cases/create-payment-order.use-case.interface';
import { CreatePaymentOrderRequestDto } from '../dto/create-order-payment-request.dto';
import { CreatePaymentOrderResponseDto } from '../dto/create-order-payment.reponse.dto';
import { IPaymentGateway } from '../ports/services/payment-gateway.interface';
import { IPaymentRepository } from '../ports/repositories/payment-repository.interface';
import { IPlanRepository } from '@/modules/super-admin/application/ports/repositories/plan-repository.interface';
import { PaymentStatus, PaymentProvider } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { ISubscriptionRepository } from '@/modules/subscription/application/ports/repositories/subscription-repository.interface';
import { SubscriptionStatus } from '@/shared/enums/subscription-status.enum';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class CreatePaymentOrderUseCase implements ICreatePaymentOrderUseCase {
  constructor(
    @Inject('IPaymentGateway')
    private readonly _paymentGateway: IPaymentGateway,
    @Inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(
    data: CreatePaymentOrderRequestDto,
  ): Promise<CreatePaymentOrderResponseDto> {
    const plan = await this._planRepository.findById(data.planId);
    if (!plan) {
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PLAN_NOT_FOUND);
    }

    const existingSub = await this._subscriptionRepository.findByTenantId(
      data.tenantId,
    );
    if (existingSub && existingSub.status === SubscriptionStatus.ACTIVE) {
      const now = new Date();
      const isFreePlan =
        !existingSub.plan || Number(existingSub.plan.price) === 0;

      if (!isFreePlan && existingSub.endDate && existingSub.endDate > now) {
        throw new BadRequestException(
          MESSAGE_CONSTANTS.ERROR.ACTIVE_PAID_SUBSCRIPTION_EXISTS,
        );
      }
    }

    const receipt = `r_${uuidv4().substring(0, 18)}`;
    const amountInSmallestUnit = Number(plan.price) * 100;

    const order = await this._paymentGateway.createOrder(
      amountInSmallestUnit,
      plan.currency,
      receipt,
    );

    const paymentData = {
      tenantId: data.tenantId,
      planId: data.planId,
      amount: Number(plan.price),
      currency: plan.currency,
      provider: PaymentProvider.RAZORPAY,
      providerOrderId: order.orderId,
      status: PaymentStatus.PENDING,
    };

    const payment = await this._paymentRepository.create(paymentData);

    return {
      paymentId: payment.id,
      orderId: order.orderId,
      amount: Number(plan.price),
      currency: plan.currency,
    };
  }
}
