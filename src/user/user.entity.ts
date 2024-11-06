import { Entity, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { UserRole } from '@/user/interface/userRole';
import { Person } from '@/person/person.entity';

@Entity()
export class User extends Person {
  @Column({
    nullable: true,
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    nullable: false,
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @Column({
    nullable: false,
    default: true,
    type: 'boolean',
  })
  status: boolean;
}
