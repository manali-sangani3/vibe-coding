import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ExpenseClaim } from './expense-claim.entity';

@Entity('expense_items')
export class ExpenseItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  claimId: string;

  @ManyToOne(() => ExpenseClaim, (claim) => claim.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'claimId' })
  claim: ExpenseClaim;

  @Column()
  category: string; // E.g., 'transport', 'accommodation', 'meals', 'misc'

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0.0 })
  amount: number;

  @Column()
  description: string;

  @Column({ nullable: true })
  receiptUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
