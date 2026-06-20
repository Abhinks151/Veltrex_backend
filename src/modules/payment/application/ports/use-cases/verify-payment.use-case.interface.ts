import { VerifyPaymentDto } from '../../dto/verify-payment.dto';
import { VerifyPaymentResponseDto } from '../../dto/verify-payment.reponse.dto';

export interface IVerifyPaymentUseCase {
  execute(data: VerifyPaymentDto): Promise<VerifyPaymentResponseDto>;
}
