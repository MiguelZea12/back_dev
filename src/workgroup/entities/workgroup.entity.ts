import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Team } from '@/team/entities/team.entity';

@Entity('work_groups')
export class WorkGroup {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @OneToMany(() => Team, (team) => team.workGroup)
  teams: Team[];
}
