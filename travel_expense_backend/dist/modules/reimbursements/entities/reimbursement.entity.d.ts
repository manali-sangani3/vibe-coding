import { ExpenseClaim } from '../../expenses/entities/expense-claim.entity';
export declare enum ReimbursementStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    PAID = "paid",
    FAILED = "failed"
}
export declare class Reimbursement {
    id: string;
    claimId: string;
    claim: ExpenseClaim;
    paymentReference: string;
    status: ReimbursementStatus;
    paidAt: Date;
    createdAt: Date;
}
