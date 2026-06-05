import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { ApprovalStage } from './entities/approval-stage.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { NotificationService } from '../notifications/notification.service';
import { User } from '../users/entities/user.entity';
export declare class SlaProcessor extends WorkerHost {
    private readonly stageRepository;
    private readonly travelRepository;
    private readonly userRepository;
    private readonly notificationService;
    constructor(stageRepository: Repository<ApprovalStage>, travelRepository: Repository<TravelRequest>, userRepository: Repository<User>, notificationService: NotificationService);
    process(job: Job<any, any, string>): Promise<any>;
}
