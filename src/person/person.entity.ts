import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
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
    nullable: true,
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
