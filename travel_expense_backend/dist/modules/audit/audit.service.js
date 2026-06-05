"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const audit_log_entity_1 = require("./entities/audit-log.entity");
let AuditService = class AuditService {
    auditRepository;
    constructor(auditRepository) {
        this.auditRepository = auditRepository;
    }
    async onModuleInit() {
        try {
            console.log('[Audit] Configuring database-level WORM constraints on "audit_logs"...');
            const connectionType = this.auditRepository.metadata.connection.options.type;
            if (connectionType === 'sqlite' || connectionType === 'better-sqlite3') {
                await this.auditRepository.query(`
          CREATE TRIGGER IF NOT EXISTS block_audit_log_updates
          BEFORE UPDATE ON audit_logs
          BEGIN
            SELECT RAISE(FAIL, 'Database WORM Constraint Violation: Audit log entries are immutable and cannot be modified.');
          END;
        `);
                await this.auditRepository.query(`
          CREATE TRIGGER IF NOT EXISTS block_audit_log_deletes
          BEFORE DELETE ON audit_logs
          BEGIN
            SELECT RAISE(FAIL, 'Database WORM Constraint Violation: Audit log entries are immutable and cannot be deleted.');
          END;
        `);
                console.log('[Audit] SQLite immutability WORM triggers active.');
            }
            else {
                await this.auditRepository.query(`
          CREATE OR REPLACE FUNCTION block_audit_log_mutations()
          RETURNS TRIGGER AS $$
          BEGIN
            RAISE EXCEPTION 'Database WORM Constraint Violation: Audit log entries are immutable and cannot be modified or deleted.';
          END;
          $$ LANGUAGE plpgsql;
        `);
                await this.auditRepository.query(`
          DROP TRIGGER IF EXISTS check_audit_log_updates ON audit_logs;
          CREATE TRIGGER check_audit_log_updates
          BEFORE UPDATE OR DELETE ON audit_logs
          FOR EACH ROW EXECUTE FUNCTION block_audit_log_mutations();
        `);
                console.log('[Audit] Postgres immutability constraints successfully bound to "audit_logs" table.');
            }
        }
        catch (error) {
            console.error('[Audit] Failed to build database WORM triggers:', error.message);
        }
    }
    async getLogs() {
        return this.auditRepository.find({
            relations: { user: true },
            order: { timestamp: 'DESC' },
        });
    }
};
exports.AuditService = AuditService;
exports.AuditService = AuditService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(audit_log_entity_1.AuditLog)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], AuditService);
//# sourceMappingURL=audit.service.js.map