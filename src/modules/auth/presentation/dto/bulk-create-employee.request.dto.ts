import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateEmployeeRequestDto } from './create-employee.request.dto';

export class BulkCreateEmployeeRequestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateEmployeeRequestDto)
  employees!: CreateEmployeeRequestDto[];
}
