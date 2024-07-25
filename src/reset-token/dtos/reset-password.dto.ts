import { IsEAN, IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class resetPDto {

  @IsEmail()
  email:string

  @IsNotEmpty()
  @IsString()
  @Min(7)
  newPassword: string;
}
