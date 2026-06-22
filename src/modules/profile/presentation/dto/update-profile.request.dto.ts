import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdateProfileRequestDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  name!: string;
}
