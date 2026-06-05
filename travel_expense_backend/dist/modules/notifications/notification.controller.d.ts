import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
export declare class NotificationController {
    private readonly notificationRepository;
    constructor(notificationRepository: Repository<Notification>);
    getNotifications(req: any): Promise<{
        success: boolean;
        data: Notification[];
    }>;
    markAsRead(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
