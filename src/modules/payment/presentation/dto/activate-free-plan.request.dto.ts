import { IsString, IsNotEmpty } from 'class-validator';

export class ActivateFreePlanRequestDto {
  @IsString()
  @IsNotEmpty()
  tenantId!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;
}
