import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateInitialVersionRequestDto {
  @IsString()
  @IsNotEmpty()
  fileUrl!: string;

  @IsOptional()
  @IsString()
  fileName?: string;

  @IsOptional()
  fileSize?: number;

  @IsOptional()
  @IsString()
  mimeType?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateNcProgramRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string;

  @ValidateNested()
  @Type(() => CreateInitialVersionRequestDto)
  initialVersion!: CreateInitialVersionRequestDto;
}
