import { User } from '../../users/entities/user.entity';
import { ApprovalStage } from '../../approvals/entities/approval-stage.entity';
export declare enum TravelStatus {
    DRAFT = "draft",
    SUBMITTED = "submitted",
    PENDING_L1 = "pending_l1",
    PENDING_L2 = "pending_l2",
    PENDING_L3 = "pending_l3",
    APPROVED = "approved",
    BOOKED = "booked",
    TRAVEL_COMPLETED = "travel_completed",
    CLAIM_DRAFT = "claim_draft",
    CLAIM_SUBMITTED = "claim_submitted",
    CLAIM_FINANCE_APPROVED = "claim_finance_approved",
    REIMBURSED = "reimbursed",
    REJECTED = "rejected",
    CANCELLED = "cancelled"
}
export declare class TravelRequest {
    id: string;
    title: string;
    description: string;
    purpose: string;
    destination: string;
    startDate: Date;
    endDate: Date;
    estimatedCost: number;
    status: TravelStatus;
    userId: string;
    user: User;
    approvalStages: ApprovalStage[];
    createdAt: Date;
}
