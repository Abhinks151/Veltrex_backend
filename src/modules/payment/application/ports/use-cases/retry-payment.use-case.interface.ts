import { CreatePaymentOrderResponseDto } from '../../dto/create-order-payment.reponse.dto';

export interface IRetryPaymentUseCase {
  execute(paymentId: string): Promise<CreatePaymentOrderResponseDto>;
}
