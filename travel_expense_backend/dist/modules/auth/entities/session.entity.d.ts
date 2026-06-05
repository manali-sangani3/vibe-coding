import { User } from '../../users/entities/user.entity';
export declare class UserSession {
    id: string;
    userId: string;
    user: User;
    tokenHash: string;
    isRevoked: boolean;
    expiresAt: Date;
    createdAt: Date;
}
