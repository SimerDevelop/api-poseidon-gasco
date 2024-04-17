import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity ('notifications')
export class Notification {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column()
    status: string;

    @Column()
    title: string;

    @Column()
    message: string;

    @Column()
    type: string;

    @Column() 
    intercourse: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
