import { Location } from 'src/locations/entities/location.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToMany(() => Usuario, { cascade: true }) 
    @JoinTable()
    operator: Usuario[];

    @ManyToMany(() => Location, { cascade: true }) 
    @JoinTable()
    locations: Location[];

    @Column()
    state: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
