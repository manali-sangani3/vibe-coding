import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { ExpenseClaim } from '../../expenses/entities/expense-claim.entity';

export enum ReimbursementStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  PAID = 'paid',
  FAILED = 'failed',
}

@Entity('reimbursements')
export class Reimbursement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  claimId: string;

  @OneToOne(() => ExpenseClaim, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claimId' })
  claim: ExpenseClaim;

  @Column({ nullable: true })
  paymentReference: string;

  @Column({
    type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
    enum: ReimbursementStatus,
    default: ReimbursementStatus.PENDING,
  })
  status: ReimbursementStatus;

  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
