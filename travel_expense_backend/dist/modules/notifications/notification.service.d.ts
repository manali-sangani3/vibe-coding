import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationService {
    private readonly notificationQueue;
    private readonly notificationRepository;
    constructor(notificationQueue: Queue, notificationRepository: Repository<Notification>);
    sendNotification(userId: string, title: string, message: string, type?: string): Promise<void>;
}
