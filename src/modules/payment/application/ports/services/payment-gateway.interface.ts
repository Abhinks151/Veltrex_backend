import { CreateOrderResponseDto } from '../../dto/create-order-response.dto';

export interface IPaymentGateway {
  createOrder(
    amount: number,
    currency: string,
    receipt: string,
  ): Promise<CreateOrderResponseDto>;

  verifySignature(
    orderId: string,
    paymentId: string,
    signature: string,
  ): boolean;
}
