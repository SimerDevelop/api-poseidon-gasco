import { Department } from "src/department/entities/department.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('cities')
export class City {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    state: string;
    
    @Column()
    latitude: string;

    @Column()
    longitude: string;

    @ManyToMany(() => Department, { cascade: true }) 
    @JoinTable()
    department: Department[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
