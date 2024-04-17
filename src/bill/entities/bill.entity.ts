import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Client } from "src/clients/entities/client.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('bill')
export class Bill {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    status: string;

    @Column('json')
    charge: any;

    @Column()
    total: number;

    @Column()
    branch_office_name: string;

    @Column()
    branch_office_nit: string;

    @Column()
    branch_office_address: string;

    @Column()
    branch_office_code: number;

    @Column()
    client_firstName: string;

    @Column()
    client_lastName: string;

    @Column()
    client_cc: string;

    @Column()
    operator_firstName: string;

    @Column()
    operator_lastName: string;

    @Column()
    densidad: string;

    @Column()
    temperatura: string;

    @Column()
    masaTotal: number;

    @Column()
    volumenTotal: string;

    @Column()
    horaInicial: string;

    @Column()
    fechaInicial: string;

    @Column()
    horaFinal: string;

    @Column()
    fechaFinal: string;

    @ManyToMany(() => Client, { cascade: true })
    @JoinTable()
    client: Client[];

    @ManyToMany(() => BranchOffices, { cascade: true })
    @JoinTable()
    branch_office: BranchOffices[];

    @ManyToMany(() => Usuario, { cascade: true })
    @JoinTable()
    operator: Usuario[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
