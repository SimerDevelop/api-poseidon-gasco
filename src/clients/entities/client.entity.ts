import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Occupation } from "src/occupation/entities/occupation.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('clients')
export class Client {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column()
    cc: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @ManyToMany(() => Occupation, { cascade: true })
    @JoinTable()
    occupation: Occupation[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
