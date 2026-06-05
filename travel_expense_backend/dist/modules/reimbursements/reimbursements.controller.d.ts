import { ReimbursementsService } from './reimbursements.service';
declare class PayoutCallbackDto {
    claimId: string;
    paymentRef: string;
    status: 'PAID' | 'FAILED';
}
export declare class ReimbursementsController {
    private readonly reimbursementsService;
    constructor(reimbursementsService: ReimbursementsService);
    getReimbursementHistory(req: any): Promise<{
        success: boolean;
        data: import("./entities/reimbursement.entity").Reimbursement[];
    }>;
    processErpPayout(apiKey: string, dto: PayoutCallbackDto): Promise<import("./entities/reimbursement.entity").Reimbursement>;
}
export {};
