import { CreatePaymentOrderRequestDto } from '../../dto/create-order-payment-request.dto';
import { CreatePaymentOrderResponseDto } from '../../dto/create-order-payment.reponse.dto';

export interface ICreatePaymentOrderUseCase {
  execute(
    data: CreatePaymentOrderRequestDto,
  ): Promise<CreatePaymentOrderResponseDto>;
}
