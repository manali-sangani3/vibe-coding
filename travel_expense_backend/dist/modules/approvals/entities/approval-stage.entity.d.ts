import { User } from '../../users/entities/user.entity';
import { TravelRequest } from '../../travel/entities/travel-request.entity';
export declare enum ApprovalStageStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REJECTED = "rejected",
    ESCALATED = "escalated",
    SKIPPED = "skipped"
}
export declare class ApprovalStage {
    id: string;
    requestId: string;
    travelRequest: TravelRequest;
    approverId: string;
    approver: User;
    level: string;
    status: ApprovalStageStatus;
    comments: string;
    updatedAt: Date;
    createdAt: Date;
}
