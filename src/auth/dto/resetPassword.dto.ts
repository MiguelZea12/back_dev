import { IsNotEmpty, IsString, IsUUID, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsUUID('4')
  @IsNotEmpty()
  resetPasswordToken: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
