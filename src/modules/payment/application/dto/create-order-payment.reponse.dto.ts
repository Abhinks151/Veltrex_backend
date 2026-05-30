export interface CreatePaymentOrderResponseDto {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
}
