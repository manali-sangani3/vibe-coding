import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';
export declare class AuditService implements OnModuleInit {
    private readonly auditRepository;
    constructor(auditRepository: Repository<AuditLog>);
    onModuleInit(): Promise<void>;
    getLogs(): Promise<AuditLog[]>;
}
