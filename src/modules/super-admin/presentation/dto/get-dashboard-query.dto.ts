import { IsOptional, IsString, IsIn } from 'class-validator';

export class GetDashboardQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(['week', 'month', 'lifetime', 'custom'])
  range?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string;
}
