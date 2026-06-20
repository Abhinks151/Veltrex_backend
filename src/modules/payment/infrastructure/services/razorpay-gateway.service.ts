import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import * as crypto from 'crypto';

import { IPaymentGateway } from '../../application/ports/services/payment-gateway.interface';
import { CreateOrderResponseDto } from '../../application/dto/create-order-response.dto';

@Injectable()
export class RazorpayGateway implements IPaymentGateway {
  private readonly _razorpay: Razorpay;

  constructor(private readonly _configService: ConfigService) {
    this._razorpay = new Razorpay({
      key_id: this._configService.getOrThrow('RAZORPAY_API_KEY'),
      key_secret: this._configService.getOrThrow('RAZORPAY_SECRET'),
    });
  }

  async createOrder(
    amount: number,
    currency: string,
    receipt: string,
  ): Promise<CreateOrderResponseDto> {
    const order = await this._razorpay.orders.create({
      amount,
      currency,
      receipt,
    });

    return {
      orderId: order.id,
      amount: Number(order.amount),
      currency: order.currency,
    };
  }

  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean {
    const payload = `${orderId}|${paymentId}`;

    const expectedSignature = crypto
      .createHmac('sha256', this._configService.getOrThrow('RAZORPAY_SECRET'))
      .update(payload)
      .digest('hex');

    return expectedSignature === signature;
  }
}
