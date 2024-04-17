import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('zones')
export class Zone {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    state: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
