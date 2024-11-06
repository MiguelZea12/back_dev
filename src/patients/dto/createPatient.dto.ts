import { IsString, IsBoolean, IsOptional, IsDate, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  idCard: number;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  gender: string;

  @IsDate()
  @IsOptional()
  birthDate: Date;

  @IsNumber()
  @IsOptional()
  age: number;

  @IsString()
  @IsOptional()
  beneficiaryType: string;

  @IsString()
  @IsOptional()
  disabilityType: string;

  @IsNumber()
  @IsOptional()
  disabilityPercentage: number;

  @IsBoolean()
  @IsOptional()
  status: boolean;

}