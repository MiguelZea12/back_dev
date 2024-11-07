import { IsString, IsOptional, IsBoolean, IsNotEmpty, IsNumber, Length } from 'class-validator';

export class CreateCaregiverDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  canton: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 100)
  parish: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 50)
  zoneType: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsNumber()
  @IsOptional()
  landline1?: number;

  @IsNumber()
  @IsOptional()
  landline2?: number;

  @IsNumber()
  @IsOptional()
  mobile1?: number;

  @IsNumber()
  @IsOptional()
  mobile2?: number;

  @IsNumber()
  @IsNotEmpty()
  documentId: number;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
