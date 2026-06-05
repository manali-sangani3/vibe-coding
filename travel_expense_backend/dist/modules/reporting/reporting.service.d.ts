import { Repository } from 'typeorm';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { ExpenseClaim } from '../expenses/entities/expense-claim.entity';
import { Reimbursement } from '../reimbursements/entities/reimbursement.entity';
import { ApprovalStage } from '../approvals/entities/approval-stage.entity';
export declare class ReportingService {
    private readonly travelRepository;
    private readonly claimRepository;
    private readonly reimbursementRepository;
    private readonly stageRepository;
    constructor(travelRepository: Repository<TravelRequest>, claimRepository: Repository<ExpenseClaim>, reimbursementRepository: Repository<Reimbursement>, stageRepository: Repository<ApprovalStage>);
    getDashboardMetrics(): Promise<{
        success: boolean;
        metrics: {
            avgApprovalTimeDays: number;
            l1SlaComplianceRate: number;
            avgReimbursementTimeDays: number;
            policyComplianceRate: number;
            totalClaimedSpend: number;
            organizationUsersClaiming: number;
        };
    }>;
    generateCsvExport(): Promise<string>;
}
