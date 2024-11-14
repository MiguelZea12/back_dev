import {
  IsString,
  IsNumber,
  IsOptional,
  IsEmail,
  IsBoolean,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { GetRoleDto } from '@/role/dto/getRole.dto';

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
  @Type(() => GetRoleDto)
  role: GetRoleDto;

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

  @Expose()
  @IsBoolean()
  deleted: boolean;
}
