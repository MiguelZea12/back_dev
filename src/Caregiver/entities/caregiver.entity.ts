import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('caregivers')
export class Caregiver {
  @PrimaryGeneratedColumn()
  id: number; 

  @Column({ type: 'varchar', length: 100 })
  canton: string; 

  @Column({ type: 'varchar', length: 100 })
  parish: string; 

  @Column({ type: 'varchar', length: 50 })
  zoneType: string; 

  @Column({ type: 'text' })
  address: string; 

  @Column({ type: 'text', nullable: true })
  reference?: string; 

  @Column({ type: 'bigint', nullable: true })
  landline1?: number; 

  @Column({ type: 'bigint', nullable: true })
  landline2?: number; 

  @Column({ type: 'bigint', nullable: true })
  mobile1?: number; 

  @Column({ type: 'bigint', nullable: true })
  mobile2?: number; 

  @Column({ type: 'bigint' })
  documentId: number; 

  @Column({ type: 'varchar', length: 100 })
  lastName: string; 

  @Column({ type: 'varchar', length: 100 })
  firstName: string; 

  @Column({ type: 'varchar', length: 10 })
  gender: string; 

  @Column({ type: 'boolean', default: true })
  isActive: boolean; 
}
