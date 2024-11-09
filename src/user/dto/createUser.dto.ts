import { IsString, IsNotEmpty, Length, IsBoolean } from 'class-validator';
import { CreatePersonDto } from '@/person/dto/createPerson.dto';
import { Type } from 'class-transformer';
import { Role } from '@/role/role.entity';

export class CreateUserDto extends CreatePersonDto {
  @IsNotEmpty()
  @Type(() => Role)
  role: Role;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
