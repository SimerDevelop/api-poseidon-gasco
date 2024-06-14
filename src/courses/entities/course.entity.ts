import { Order } from 'src/orders/entities/order.entity';
import { PropaneTruck } from 'src/propane-truck/entities/propane-truck.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';

@Entity('courses')
export class Course {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Usuario, { cascade: true })
    operator: Usuario;

    @ManyToOne(() => PropaneTruck, { cascade: true })
    propane_truck: PropaneTruck;

    @ManyToMany(() => Order, { cascade: true }) 
    @JoinTable()
    orders: Order[];

    @Column()
    operator_id: string;

    @Column()
    state: string;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
