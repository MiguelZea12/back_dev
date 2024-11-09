import { Entity, Column, ManyToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Person } from '@/person/person.entity';
import { Role } from '@/role/role.entity';

@Entity()
export class User extends Person {
  @Column()
  @Exclude()
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @Column({
    nullable: false,
    default: true,
    type: 'boolean',
  })
  status: boolean;
}
