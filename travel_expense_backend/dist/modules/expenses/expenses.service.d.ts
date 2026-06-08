import { Repository } from 'typeorm';
import { ExpenseClaim } from './entities/expense-claim.entity';
import { ExpenseItem } from './entities/expense-item.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { CreateExpenseClaimDto } from './dto/create-expense.dto';
import { NotificationService } from '../notifications/notification.service';
import { ComplianceService } from '../compliance/compliance.service';
import { User } from '../users/entities/user.entity';
export declare class ExpensesService {
    private readonly claimRepository;
    private readonly itemRepository;
    private readonly travelRepository;
    private readonly userRepository;
    private readonly auditRepository;
    private readonly notificationService;
    private readonly complianceService;
    constructor(claimRepository: Repository<ExpenseClaim>, itemRepository: Repository<ExpenseItem>, travelRepository: Repository<TravelRequest>, userRepository: Repository<User>, auditRepository: Repository<AuditLog>, notificationService: NotificationService, complianceService: ComplianceService);
    submitExpenseClaim(userId: string, dto: CreateExpenseClaimDto): Promise<ExpenseClaim>;
    getExpenseClaims(userId: string): Promise<ExpenseClaim[]>;
    getPendingExpenseApprovals(userId: string): Promise<ExpenseClaim[]>;
    getExpenseClaimById(userId: string, id: string): Promise<ExpenseClaim>;
    managerApproveExpenseClaim(userId: string, claimId: string): Promise<ExpenseClaim>;
    approveExpenseClaim(userId: string, claimId: string): Promise<ExpenseClaim>;
}
