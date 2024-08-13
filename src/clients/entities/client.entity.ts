import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Occupation } from "src/occupation/entities/occupation.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('clients')
export class Client {

    @PrimaryColumn('uuid')
    id: string;

    @Column({ default: '' })
    state: string;

    @Column({ default: '' })
    firstName: string;

    @Column({ default: '' })
    lastName: string;

    @Column({ default: '' })
    cc: string;

    @Column({ default: '' })
    phone: string;

    @Column({ default: '' })
    email: string;

    @ManyToMany(() => Occupation, { cascade: true })
    @JoinTable()
    occupation: Occupation[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
