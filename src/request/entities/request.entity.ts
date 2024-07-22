import { BranchOffices } from "src/branch-offices/entities/branch-office.entity";
import { Order } from "src/orders/entities/order.entity";
import { PropaneTruck } from "src/propane-truck/entities/propane-truck.entity";
import { Usuario } from "src/usuarios/entities/usuario.entity";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity('request')
export class Request {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    state: string;

    @Column({ type: 'int', width: 7 })
    folio: number;

    @Column({ type: 'int', width: 7 })
    internal_folio: number;

    @Column()
    payment_type: string;

    @Column('json')
    data_series: any;

    @Column()
    branch_office_code: number;

    @ManyToOne(() => BranchOffices, { cascade: true })
    branch_office: BranchOffices;

    @Column()
    plate: string;

    @Column()
    idNumber: string;

    @ManyToOne(() => PropaneTruck, { cascade: true })
    propane_truck: PropaneTruck;

    @ManyToOne(() => Usuario, { cascade: true })
    operator: Usuario;

    @ManyToOne(() => Order, { cascade: true })
    order: Order;

    @CreateDateColumn()
    create: Date;

    @UpdateDateColumn()
    update: Date;
}
