import { IsString, IsNotEmpty } from 'class-validator';

export class CreateWorkGroupDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
