import { Permissions } from 'src/permissions/entities/permission.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';

@Entity('roles')
export class Roles {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  state: string;

  @ManyToMany(() => Permissions, { cascade: true }) // Define la relación ManyToMany con Permission
  @JoinTable() // Esta anotación se utiliza para configurar la tabla de unión automáticamente
  permissions: Permissions[];

  @CreateDateColumn()
  create: Date;

  @UpdateDateColumn()
  update: Date;
}
