import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  @IsNotEmpty()
  workGroupId: number;
}
