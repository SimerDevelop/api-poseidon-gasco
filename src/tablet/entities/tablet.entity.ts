import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Tablet {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    mac: string;

    @Column()
    batteryPercent: number;

    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @ManyToMany(() => Usuario, { cascade: true }) 
    @JoinTable()
    operator: Usuario[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}

