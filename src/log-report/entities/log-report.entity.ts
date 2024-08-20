import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { RouteEvent } from "src/route-events/entities/route-event.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";

@Entity()
export class LogReport {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;
    
    @Column()
    code_event: number;

    @Column()
    userId: string;

    @ManyToOne(() => RouteEvent, { cascade: true })
    route_event: RouteEvent;

    @ManyToOne(() => Usuario, { cascade: true })
    user: Usuario;

    @Column({ nullable: true, type: 'json'})
    propane_truck: any;

    @Column('json')

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
