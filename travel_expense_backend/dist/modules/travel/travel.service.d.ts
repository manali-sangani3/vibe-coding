import { Repository } from 'typeorm';
import { TravelRequest } from './entities/travel-request.entity';
import { User } from '../users/entities/user.entity';
import { ApprovalWorkflowPolicy } from '../approvals/entities/workflow-policy.entity';
import { ApprovalStage } from '../approvals/entities/approval-stage.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { CreateTravelRequestDto } from './dto/create-travel-request.dto';
import { NotificationService } from '../notifications/notification.service';
export declare class TravelService {
    private readonly travelRepository;
    private readonly userRepository;
    private readonly policyRepository;
    private readonly approvalStageRepository;
    private readonly auditRepository;
    private readonly notificationService;
    constructor(travelRepository: Repository<TravelRequest>, userRepository: Repository<User>, policyRepository: Repository<ApprovalWorkflowPolicy>, approvalStageRepository: Repository<ApprovalStage>, auditRepository: Repository<AuditLog>, notificationService: NotificationService);
    submitTravelRequest(userId: string, dto: CreateTravelRequestDto): Promise<TravelRequest>;
    getTravelRequests(userId: string): Promise<TravelRequest[]>;
    getTravelRequestById(userId: string, id: string): Promise<TravelRequest>;
    cancelTravelRequest(userId: string, id: string): Promise<TravelRequest>;
}
