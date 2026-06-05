import { Repository } from 'typeorm';
import { Reimbursement } from './entities/reimbursement.entity';
import { ExpenseClaim } from '../expenses/entities/expense-claim.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationService } from '../notifications/notification.service';
export declare class ReimbursementsService {
    private readonly reimbursementRepository;
    private readonly claimRepository;
    private readonly travelRepository;
    private readonly auditRepository;
    private readonly notificationService;
    constructor(reimbursementRepository: Repository<Reimbursement>, claimRepository: Repository<ExpenseClaim>, travelRepository: Repository<TravelRequest>, auditRepository: Repository<AuditLog>, notificationService: NotificationService);
    getReimbursementHistory(userId: string): Promise<Reimbursement[]>;
    processErpPayout(apiKey: string, claimId: string, paymentRef: string, status: string): Promise<Reimbursement>;
}
