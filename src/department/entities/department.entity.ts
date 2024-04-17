import { City } from "src/city/entities/city.entity";
import { Column, CreateDateColumn, Entity, ManyToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity('departments')
export class Department {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column()
    state: string;

    @ManyToMany(() => City, city => city.department)
    cities: City[];

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
