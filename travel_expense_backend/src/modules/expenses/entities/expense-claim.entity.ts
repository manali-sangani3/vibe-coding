import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TravelRequest } from '../../travel/entities/travel-request.entity';
import { ExpenseItem } from './expense-item.entity';

export enum ClaimStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_MANAGER = 'pending_manager',
  PENDING_DEPT_HEAD = 'pending_dept_head',
  PENDING_FINANCE = 'pending_finance',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  REIMBURSED = 'reimbursed',
}

@Entity('expense_claims')
export class ExpenseClaim {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  travelRequestId: string;

  @ManyToOne(() => TravelRequest, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'travelRequestId' })
  travelRequest: TravelRequest;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  claimAmount: number;

  @Column({
    type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
    enum: ClaimStatus,
    default: ClaimStatus.DRAFT,
  })
  status: ClaimStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ExpenseItem, (item) => item.claim, { cascade: true })
  items: ExpenseItem[];

  @Column({ nullable: true })
  submittedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
