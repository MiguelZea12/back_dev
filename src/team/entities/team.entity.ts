import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkGroup } from '@/workgroup/entities/workgroup.entity';

@Entity('teams')
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @ManyToOne(() => WorkGroup, (workGroup) => workGroup.teams, { nullable: false, onDelete: 'CASCADE' })
  workGroup: WorkGroup;
}
