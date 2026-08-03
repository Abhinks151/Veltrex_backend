import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateNested,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

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
  @Matches(/^[a-zA-Z\s]*$/, {
    message: MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_DESCRIPTION_CHARACTERS_ONLY,
  })
  description?: string;
}

export class CreateNcProgramRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_CHARACTERS_ONLY,
  })
  name!: string;

  @ValidateNested()
  @Type(() => CreateInitialVersionRequestDto)
  initialVersion!: CreateInitialVersionRequestDto;
}
