import { IsEmail } from 'class-validator';

export class forgotPDto {
  
  @IsEmail()
  email: string;

  
}
