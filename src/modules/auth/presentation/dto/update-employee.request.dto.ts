import { IsOptional, IsString, IsEnum } from 'class-validator';
import { Role } from '@/shared/enums/roles.enum';

export class UpdateEmployeeRequestDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}
