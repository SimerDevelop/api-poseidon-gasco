import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('route-events')
export class RouteEvent {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column()
    suggestion: string;

    @Column()
    criticality: number;

    @Column()
    code_event: number;

    @Column()
    state: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
