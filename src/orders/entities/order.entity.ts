import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('order')
export class Order {
    @PrimaryColumn('uuid')
    id: string;

    @Column({ type: 'int', width: 7 })
    folio: number;

    @Column()
    state: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
