import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('occupations')
export class Occupation {

    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    name: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
