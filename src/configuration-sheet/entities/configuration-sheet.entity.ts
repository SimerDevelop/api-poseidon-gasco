import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('configuration-sheet')
export class ConfigurationSheet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    company: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    country_code: string;

    @Column()
    country: string;

    @Column({ type: 'longblob' }) // Para MySQL
    image: Buffer;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
