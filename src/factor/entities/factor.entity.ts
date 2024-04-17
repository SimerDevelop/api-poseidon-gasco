import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('factor')
export class Factor {
    @PrimaryColumn('uuid')
    id: string;

    @Column('double precision')
    value: number;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
