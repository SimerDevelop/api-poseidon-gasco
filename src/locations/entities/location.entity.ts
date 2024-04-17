import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('locations')
export class Location {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @ManyToMany(() => BranchOffices, { cascade: true }) 
    @JoinTable()
    branch_offices: BranchOffices[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
