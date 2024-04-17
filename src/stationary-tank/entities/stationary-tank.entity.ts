import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('stationary-tank')
export class StationaryTank {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    status: string;

    @Column()
    serial: string;

    @Column()
    capacity: number;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
