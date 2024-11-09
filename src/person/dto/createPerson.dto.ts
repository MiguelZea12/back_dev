import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePersonDto {
  @IsString()
  @IsNotEmpty()
  document: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  direction?: string;
}
