import { User } from '../../users/entities/user.entity';
export declare class AuditLog {
    id: string;
    userId: string;
    user: User;
    action: string;
    entityName: string;
    entityId: string;
    metadata: Record<string, any>;
    timestamp: Date;
}
