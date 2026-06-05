import { ExpenseClaim } from './expense-claim.entity';
export declare class ExpenseItem {
    id: string;
    claimId: string;
    claim: ExpenseClaim;
    category: string;
    amount: number;
    description: string;
    receiptUrl: string;
    createdAt: Date;
}
