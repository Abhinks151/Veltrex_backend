import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMaintenanceTicketRequest {
  @IsUUID('4', { message: 'Invalid machine ID format' })
  @IsNotEmpty({ message: 'Machine ID is required' })
  machineId!: string;

  @IsString({ message: 'Issue must be a string' })
  @IsNotEmpty({ message: 'Issue is required' })
  issue!: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsInt({ message: 'Estimated duration must be an integer' })
  @Min(1, { message: 'Estimated duration must be at least 1 minute' })
  @IsOptional()
  estimatedDurationMinutes?: number;
}
