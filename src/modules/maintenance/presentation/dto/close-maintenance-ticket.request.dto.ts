import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CloseMaintenanceTicketRequest {
  @IsString({ message: 'Reason must be a string' })
  @IsNotEmpty({ message: 'Reason is required' })
  @MinLength(5, { message: 'Reason must be at least 5 characters long' })
  reason!: string;

  @IsInt({ message: 'Actual duration must be an integer' })
  @Min(1, { message: 'Actual duration must be at least 1 minute' })
  @IsOptional()
  actualDurationMinutes?: number;
}
