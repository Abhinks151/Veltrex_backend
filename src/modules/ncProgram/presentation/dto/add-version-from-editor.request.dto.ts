import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { MESSAGE_CONSTANTS } from '@/shared/enums/messageConstants';

export class AddVersionFromEditorRequestDto {
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
