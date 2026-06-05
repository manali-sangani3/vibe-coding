import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum UserRole {
  EMPLOYEE = 'Employee',
  MANAGER = 'Manager',
  FINANCE = 'Finance Executive',
  COMPLIANCE = 'Compliance Officer',
  ADMIN = 'Admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({
    type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
    enum: UserRole,
    default: UserRole.EMPLOYEE,
  })
  role: UserRole;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  managerId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'managerId' })
  manager: User;

  @CreateDateColumn()
  createdAt: Date;
}
