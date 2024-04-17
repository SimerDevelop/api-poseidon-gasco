import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('permissions')
export class Permissions {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  accessCode: string;

  @Column()
  state: string;

  @Column('text')
  description: string;

  @CreateDateColumn()
  create: Date;

  @UpdateDateColumn()
  update: Date;
}

