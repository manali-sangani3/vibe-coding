import { ReportingService } from './reporting.service';
export declare class ReportingController {
    private readonly reportingService;
    constructor(reportingService: ReportingService);
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
    exportCsvReport(res: any): Promise<any>;
}
