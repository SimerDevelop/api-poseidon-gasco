import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Occupation } from "src/occupation/entities/occupation.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('clients')
export class Client {

    @PrimaryColumn('uuid')
    id: string;

    @Column({ default: '', nullable: false })
    state: string;

    @Column({ default: '', nullable: false })
    firstName: string;

    @Column({ default: '', nullable: false })
    lastName: string;

    @Column({ default: '', nullable: false })
    cc: string;

    @Column({ default: '', nullable: false })
    phone: string;

    @Column({ default: '', nullable: false })
    email: string;

    @ManyToMany(() => Occupation, { cascade: true })
    @JoinTable()
    occupation: Occupation[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
