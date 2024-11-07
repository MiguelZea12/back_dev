import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '@/user/user.entity';
import { Team } from '@/team/entities/team.entity';

@Entity('assignments')
export class Assignment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Team, { nullable: false, onDelete: 'CASCADE' })
  team: Team;

  @CreateDateColumn()
  assignedAt: Date;
}
