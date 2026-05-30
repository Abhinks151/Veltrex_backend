import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IVerifyPaymentUseCase } from '../ports/use-cases/verify-payment.use-case.interface';
import { VerifyPaymentDto } from '../dto/verify-payment.dto';
import { VerifyPaymentResponseDto } from '../dto/verify-payment.reponse.dto';
import { ITransactionManager } from '@/shared/application/ports/transaction-manager.interface';
import { IPaymentGateway } from '../ports/services/payment-gateway.interface';
import { IPaymentRepository } from '../ports/repositories/payment-repository.interface';
import { IPlanRepository } from '@/modules/super-admin/application/ports/repositories/plan-repository.interface';
import { ISubscriptionRepository } from '@/modules/subscription/application/ports/repositories/subscription-repository.interface';
import { PaymentStatus, SubscriptionStatus } from '@prisma/client';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

@Injectable()
export class VerifyPaymentUseCase implements IVerifyPaymentUseCase {
  constructor(
    @Inject('ITransactionManager')
    private readonly _txManager: ITransactionManager,
    @Inject('IPaymentGateway')
    private readonly _paymentGateway: IPaymentGateway,
    @Inject('IPaymentRepository')
    private readonly _paymentRepository: IPaymentRepository,
    @Inject('IPlanRepository')
    private readonly _planRepository: IPlanRepository,
    @Inject('ISubscriptionRepository')
    private readonly _subscriptionRepository: ISubscriptionRepository,
  ) {}

  async execute(data: VerifyPaymentDto): Promise<VerifyPaymentResponseDto> {
    const payment = await this._paymentRepository.findById(data.paymentId);
    if (!payment)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PAYMENT_NOT_FOUND);

    if (payment.status === PaymentStatus.SUCCESS) {
      return { success: true, subscriptionId: payment.subscriptionId ?? '' };
    }

    const isValid = this._paymentGateway.verifySignature(
      data.razorpayOrderId,
      data.razorpayPaymentId,
      data.razorpaySignature,
    );

    if (!isValid) {
      await this._paymentRepository.update(payment.id, {
        status: PaymentStatus.FAILED,
      });
      throw new BadRequestException(
        MESSAGE_CONSTANTS.ERROR.INVALID_PAYMENT_SIGNATURE,
      );
    }

    if (!payment.planId) {
      throw new BadRequestException(MESSAGE_CONSTANTS.ERROR.PAYMENT_NO_PLAN);
    }

    const plan = await this._planRepository.findById(payment.planId);
    if (!plan)
      throw new NotFoundException(MESSAGE_CONSTANTS.ERROR.PLAN_NOT_FOUND);

    const startDate = new Date();
    const endDate = new Date();
    if (plan.durationDays) {
      endDate.setDate(endDate.getDate() + plan.durationDays);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 100);
    }

    return this._txManager.run(async (ctx) => {
      const txPayment = await this._paymentRepository.findById(payment.id, ctx);
      if (!txPayment || txPayment.status === PaymentStatus.SUCCESS) {
        return {
          success: true,
          subscriptionId: txPayment?.subscriptionId ?? '',
        };
      }

      const existing = await this._subscriptionRepository.findActiveByTenantId(
        payment.tenantId,
        ctx,
      );
      if (existing) {
        await this._subscriptionRepository.expireSubscription(existing.id, ctx);
      }

      const subscription = await this._subscriptionRepository.create(
        {
          tenantId: payment.tenantId,
          planId: plan.id,
          status: SubscriptionStatus.ACTIVE,
          startDate,
          endDate,
          razorpaySubscriptionId: data.razorpayPaymentId,
        },
        ctx,
      );

      await this._paymentRepository.update(
        payment.id,
        {
          status: PaymentStatus.SUCCESS,
          providerPaymentId: data.razorpayPaymentId,
          subscriptionId: subscription.id,
          paidAt: new Date(),
        },
        ctx,
      );

      return { success: true, subscriptionId: subscription.id };
    });
  }
}
