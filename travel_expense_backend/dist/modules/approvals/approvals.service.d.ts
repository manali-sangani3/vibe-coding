import { Repository } from 'typeorm';
import { ApprovalStage } from './entities/approval-stage.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { NotificationService } from '../notifications/notification.service';
import { Queue } from 'bullmq';
import { User } from '../users/entities/user.entity';
export declare class ApprovalsService {
    private readonly approvalStageRepository;
    private readonly travelRepository;
    private readonly auditRepository;
    private readonly notificationService;
    private readonly slaQueue;
    private readonly userRepository;
    constructor(approvalStageRepository: Repository<ApprovalStage>, travelRepository: Repository<TravelRequest>, auditRepository: Repository<AuditLog>, notificationService: NotificationService, slaQueue: Queue, userRepository: Repository<User>);
    getPendingApprovals(managerId: string): Promise<ApprovalStage[]>;
    queueSlaJob(stageId: string): Promise<void>;
    processOfflineSla(stageId: string): Promise<void>;
    approveStage(stageId: string, approverId: string): Promise<ApprovalStage>;
    rejectStage(stageId: string, approverId: string, reason: string): Promise<ApprovalStage>;
}
