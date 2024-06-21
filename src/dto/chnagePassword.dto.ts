import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ChangePDto {

  @IsNotEmpty()
  @IsString()
  @Min(7)
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @Min(7)
  newPassword: string;
}
