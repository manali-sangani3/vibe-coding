import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    getAuditLogs(): Promise<{
        success: boolean;
        data: import("./entities/audit-log.entity").AuditLog[];
    }>;
}
