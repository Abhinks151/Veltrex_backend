import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class EditNcProgramRequestDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name?: string;
}
