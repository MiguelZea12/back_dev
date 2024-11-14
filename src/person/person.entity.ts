import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['document'])
@Unique(['email'])
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  document: string;

  @Column({
    nullable: true,
    length: 100,
  })
  name: string;

  @Column({
    nullable: true,
    length: 100,
  })
  lastName: string;

  @Column({
    nullable: false,
    length: 100,
  })
  email: string;

  @Column({ nullable: true })
  direction: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updateAt: Date;

  @Column({ default: false })
  deleted: boolean;
}
