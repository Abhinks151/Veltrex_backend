import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '@/shared/common/dto/pagination-query.dto';

export class ListEmployeesQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  sort?: 'asc' | 'desc';
}
