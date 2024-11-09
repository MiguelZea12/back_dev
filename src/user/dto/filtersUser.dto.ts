import { IsString, IsOptional, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class FiltersUserDto {
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  username?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value || undefined)
  name_role?: string;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'Page debe ser mayor que 1' })
  @Transform(({ value }) => parseInt(value, 10))
  page?: number;

  @IsOptional()
  @IsInt()
  @Min(1, { message: 'El limite debe ser más grande que 1' })
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number;
}
