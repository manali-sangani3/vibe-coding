import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TravelRequest } from '../../travel/entities/travel-request.entity';

export enum ApprovalStageStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  ESCALATED = 'escalated',
  SKIPPED = 'skipped',
}

@Entity('approval_stages')
export class ApprovalStage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  requestId: string;

  @ManyToOne(() => TravelRequest, (tr) => tr.approvalStages, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'requestId' })
  travelRequest: TravelRequest;

  @Column()
  approverId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'approverId' })
  approver: User;

  @Column()
  level: string; // E.g., 'L1_MANAGER', 'L2_DEPT_HEAD', 'L3_FINANCE'

  @Column({
    type: process.env.OFFLINE_MODE === 'true' ? 'simple-enum' : 'enum',
    enum: ApprovalStageStatus,
    default: ApprovalStageStatus.PENDING,
  })
  status: ApprovalStageStatus;

  @Column({ type: 'text', nullable: true })
  comments: string;

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
