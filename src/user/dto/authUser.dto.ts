import { IsString, IsNumber, IsEmail } from 'class-validator';

export class AuthUserDto {
  @IsNumber()
  id: number;

  @IsString()
  document: string;

  @IsString()
  password: string;

  @IsEmail()
  email: string;
}
