import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('approval_workflow_policies')
export class ApprovalWorkflowPolicy {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  department: string; // E.g., 'Engineering' or '*' for wildcards

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  minBudget: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 9999999.0 })
  maxBudget: number;

  @Column({ type: 'json' })
  requiredLevels: string[]; // E.g., ['L1_MANAGER', 'L2_DEPT_HEAD', 'L3_FINANCE']

  @CreateDateColumn()
  createdAt: Date;
}
