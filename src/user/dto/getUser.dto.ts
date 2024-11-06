import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Expose } from 'class-transformer';
import { UserRole } from '../interface/userRole';

export class GetUserDto {
  @Expose()
  @IsNumber()
  id: number;

  @Expose()
  @IsString()
  username: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum(UserRole)
  role: UserRole;

  @Expose()
  @IsBoolean()
  status: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  document?: string;

  @Expose()
  @IsOptional()
  @IsString()
  direction?: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;
}
