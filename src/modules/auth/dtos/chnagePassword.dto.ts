import { IsNotEmpty, IsString, Min } from 'class-validator';

export class ChangePDto {

  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
