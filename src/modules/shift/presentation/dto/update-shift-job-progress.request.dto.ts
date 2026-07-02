import { IsInt, Min } from 'class-validator';

export class UpdateShiftJobProgressRequest {
  @IsInt()
  @Min(0)
  completedQuantity!: number;
}
