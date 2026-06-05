import { WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationProcessor extends WorkerHost {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    process(job: Job<any, any, string>): Promise<any>;
}
