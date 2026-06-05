import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  action: string; // E.g., 'SSO_LOGIN', 'TRAVEL_SUBMIT', 'APPROVAL_APPROVED', 'CLAIM_REIMBURSED'

  @Column()
  entityName: string; // E.g., 'TravelRequest', 'ExpenseClaim', etc.

  @Column({ nullable: true })
  entityId: string;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  timestamp: Date;
}
