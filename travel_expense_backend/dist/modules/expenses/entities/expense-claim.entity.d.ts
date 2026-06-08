import { User } from '../../users/entities/user.entity';
import { TravelRequest } from '../../travel/entities/travel-request.entity';
import { ExpenseItem } from './expense-item.entity';
export declare enum ClaimStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PENDING_MANAGER = "pending_manager",
    PENDING_DEPT_HEAD = "pending_dept_head",
    PENDING_FINANCE = "pending_finance",
    APPROVED = "approved",
    REJECTED = "rejected",
    REIMBURSED = "reimbursed"
}
export declare class ExpenseClaim {
    id: string;
    travelRequestId: string;
    travelRequest: TravelRequest;
    claimAmount: number;
    status: ClaimStatus;
    userId: string;
    user: User;
    items: ExpenseItem[];
    submittedAt: Date;
    createdAt: Date;
}
