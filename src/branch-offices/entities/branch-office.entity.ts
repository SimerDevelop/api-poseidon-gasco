import { City } from 'src/city/entities/city.entity';
import { Client } from 'src/clients/entities/client.entity';
import { Factor } from 'src/factor/entities/factor.entity';
import { StationaryTank } from 'src/stationary-tank/entities/stationary-tank.entity';
import { Zone } from 'src/zone/entities/zone.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, IntegerType } from 'typeorm';

@Entity('branch-offices')
export class BranchOffices {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    nit: string;

    @Column({ nullable: false })
    branch_office_code: number;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    latitude: string;

    @Column({ nullable: false })
    longitude: string;

    @Column({ nullable: false })
    state: string;

    @Column({ nullable: false })
    status: string;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    kilogramValue: number;

    @Column({ nullable: false })
    tank_stock: number;

    @Column({ nullable: false })
    general_ticket: boolean;

    @Column({ type: 'text' })
    geofence: string;

    @ManyToMany(() => Factor, { cascade: true }) // Define la relación ManyToMany con Permission
    @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
    factor: Factor[];

    @ManyToMany(() => City, { cascade: true }) // Define la relación ManyToMany con Permission
    @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
    city: City[];

    @ManyToMany(() => Zone, { cascade: true }) // Define la relación ManyToMany con Permission
    @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
    zone: Zone[];

    @ManyToMany(() => Client, { cascade: true }) // Define la relación ManyToMany con Permission
    @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
    client: Client[];

    @ManyToMany(() => StationaryTank, { cascade: true }) // Define la relación ManyToMany con Permission
    @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
    stationary_tanks: StationaryTank[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
