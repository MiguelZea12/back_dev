import {
  IsString,
  IsNotEmpty,
  IsEnum,
  Length,
  IsBoolean,
} from 'class-validator';
import { Person } from '@/person/person.entity';
import { UserRole } from '@/user/interface/userRole';

export class CreateUserDto extends Person {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsBoolean()
  @IsNotEmpty()
  status: boolean;
}
