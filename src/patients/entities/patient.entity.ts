import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('patients')
export class Patient {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'bigint', unique: true })
    idCard: number;
    
    @Column({ type: 'varchar', length: 255, nullable: true })
    fullName: string;

    @Column({ type: 'varchar', length: 10, nullable: true })
    gender: string;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({ type: 'int', nullable: true })
    age: number;

    @Column({ type: 'varchar', length: 50, nullable: true })
    beneficiaryType: string;

    @Column({ type: 'varchar', length: 40, nullable: true })
    disabilityType: string;

    @Column({ type: 'float', nullable: true })
    disabilityPercentage: number;

    @Column({ type: 'boolean', length: 50, nullable: true })
    status: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}