import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('propane-trucks')
export class PropaneTruck {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    status: string;

    @Column()
    plate: string;

    @Column()
    capacity: number;

    @Column({ default: 0.0 , type: 'float' })
    factor: number;

    @ManyToMany(() => Usuario, { cascade: true })
    @JoinTable()
    operator: Usuario[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
