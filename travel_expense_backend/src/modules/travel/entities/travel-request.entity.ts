import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ApprovalStage } from '../../approvals/entities/approval-stage.entity';

export enum TravelStatus {
  DRAFT = 'draft',
  SUBMITTED = 'submitted',
  PENDING_L1 = 'pending_l1',
  PENDING_L2 = 'pending_l2',
  PENDING_L3 = 'pending_l3',
  APPROVED = 'approved',
  BOOKED = 'booked',
  TRAVEL_COMPLETED = 'travel_completed',
  CLAIM_DRAFT = 'claim_draft',
  CLAIM_SUBMITTED = 'claim_submitted',
  CLAIM_FINANCE_APPROVED = 'claim_finance_approved',
  REIMBURSED = 'reimbursed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

@Entity('travel_requests')
export class TravelRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column()
  purpose: string;

  @Column()
  destination: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  estimatedCost: number;

  @Column({
    type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
    enum: TravelStatus,
    default: TravelStatus.DRAFT,
  })
  status: TravelStatus;

  @Column()
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToMany(() => ApprovalStage, (stage) => stage.travelRequest)
  approvalStages: ApprovalStage[];

  @CreateDateColumn()
  createdAt: Date;
}
