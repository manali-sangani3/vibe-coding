import { ApprovalsService } from './approvals.service';
import { RejectApprovalDto } from './dto/reject-approval.dto';
export declare class ApprovalsController {
    private readonly approvalsService;
    constructor(approvalsService: ApprovalsService);
    getPendingApprovals(req: any): Promise<{
        success: boolean;
        data: import("./entities/approval-stage.entity").ApprovalStage[];
    }>;
    approveStage(id: string, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/approval-stage.entity").ApprovalStage;
    }>;
    rejectStage(id: string, dto: RejectApprovalDto, req: any): Promise<{
        success: boolean;
        message: string;
        data: import("./entities/approval-stage.entity").ApprovalStage;
    }>;
}
