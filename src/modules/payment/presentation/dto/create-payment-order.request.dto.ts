import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentOrderRequestDto {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;
}
