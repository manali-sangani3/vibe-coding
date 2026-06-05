import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../users/entities/user.entity';
import { UserSession } from './entities/session.entity';
export declare class AuthService {
    private readonly userRepository;
    private readonly sessionRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, sessionRepository: Repository<UserSession>, jwtService: JwtService);
    ssoLogin(ssoToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            department: string;
            avatarUrl: string;
        };
    }>;
    refresh(refreshToken: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: UserRole;
            department: string;
            avatarUrl: string;
        };
    }>;
    logout(userId: string): Promise<void>;
    private generateTokens;
    private hashToken;
}
