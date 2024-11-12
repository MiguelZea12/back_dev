import { IsString, IsNumber, IsEmail, IsUUID } from 'class-validator';

export class AuthUserDto {
  @IsNumber()
  id: number;

  @IsString()
  document: string;

  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsString()
  password: string;

  @IsUUID('4')
  resetPasswordToken: string;

  @IsEmail()
  email: string;
}
