import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  Matches,
} from 'class-validator';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class CreateNcProgramFromEditorRequestDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @Matches(/^[a-zA-Z\s]+$/, {
    message: MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_NAME_CHARACTERS_ONLY,
  })
  name!: string;

  @IsString()
  @IsNotEmpty()
  content!: string;

  @IsOptional()
  @IsString()
  @Matches(/^[a-zA-Z\s]*$/, {
    message: MESSAGE_CONSTANTS.ERROR.NC_PROGRAM_DESCRIPTION_CHARACTERS_ONLY,
  })
  description?: string;
}
