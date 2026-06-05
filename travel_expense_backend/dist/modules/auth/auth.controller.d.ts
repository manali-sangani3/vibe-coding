import { AuthService } from './auth.service';
declare class SsoLoginDto {
    ssoToken: string;
}
declare class RefreshTokenDto {
    refreshToken: string;
}
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    ssoLogin(body: SsoLoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            avatarUrl: string;
        };
    }>;
    refresh(body: RefreshTokenDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            role: import("../users/entities/user.entity").UserRole;
            department: string;
            avatarUrl: string;
        };
    }>;
    logout(req: any): Promise<{
        success: boolean;
        message: string;
    }>;
    getProfile(req: any): Promise<{
        success: boolean;
        user: {
            id: any;
            email: any;
            name: any;
            role: any;
            department: any;
            avatarUrl: any;
        };
    }>;
}
export {};
