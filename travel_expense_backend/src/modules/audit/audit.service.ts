import { Injectable, OnModuleInit, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService implements OnModuleInit {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async onModuleInit() {
    try {
      console.log('[Audit] Configuring database-level WORM constraints on "audit_logs"...');

      const connectionType: any = this.auditRepository.metadata.connection.options.type;

      if (connectionType === 'sqlite' || connectionType === 'better-sqlite3') {
        // SQLite Trigger for immutability (WORM)
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
      } else {
        // Postgres functions & triggers to block updates/deletes
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
    } catch (error: any) {
      console.error('[Audit] Failed to build database WORM triggers:', error.message);
    }
  }

  async getLogs() {
    return this.auditRepository.find({
      relations: { user: true },
      order: { timestamp: 'DESC' },
    });
  }
}
