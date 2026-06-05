import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

// Entities
import { User } from './modules/users/entities/user.entity';
import { UserSession } from './modules/auth/entities/session.entity';
import { TravelRequest } from './modules/travel/entities/travel-request.entity';
import { ApprovalWorkflowPolicy } from './modules/approvals/entities/workflow-policy.entity';
import { ApprovalStage } from './modules/approvals/entities/approval-stage.entity';
import { ExpenseClaim } from './modules/expenses/entities/expense-claim.entity';
import { ExpenseItem } from './modules/expenses/entities/expense-item.entity';
import { Reimbursement } from './modules/reimbursements/entities/reimbursement.entity';
import { Notification } from './modules/notifications/entities/notification.entity';
import { AuditLog } from './modules/audit/entities/audit-log.entity';

// Database Services
import { SeedService } from './modules/database/seed.service';

// Modules
import { AuthModule } from './modules/auth/auth.module';
import { StorageModule } from './modules/storage/storage.module';
import { NotificationModule } from './modules/notifications/notification.module';
import { TravelModule } from './modules/travel/travel.module';
import { ApprovalsModule } from './modules/approvals/approvals.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { ReimbursementsModule } from './modules/reimbursements/reimbursements.module';
import { AuditModule } from './modules/audit/audit.module';
import { ReportingModule } from './modules/reporting/reporting.module';
import { BullModule } from '@nestjs/bullmq';

const isOffline = process.env.OFFLINE_MODE === 'true';

const moduleImports = [
  // Configuration Module
  ConfigModule.forRoot({
    isGlobal: true,
  }),
  
  AuthModule,
  StorageModule,
  NotificationModule,
  TravelModule,
  ApprovalsModule,
  ExpensesModule,
  ReimbursementsModule,
  AuditModule,
  ReportingModule,
  
  TypeOrmModule.forRoot(
    isOffline
      ? {
          type: 'better-sqlite3' as any,
          database: 'db.sqlite',
          entities: [
            User,
            UserSession,
            TravelRequest,
            ApprovalWorkflowPolicy,
            ApprovalStage,
            ExpenseClaim,
            ExpenseItem,
            Reimbursement,
            Notification,
            AuditLog,
          ],
          synchronize: true,
        }
      : {
          type: 'postgres' as any,
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432', 10),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_DATABASE || 'travelexpense',
          entities: [
            User,
            UserSession,
            TravelRequest,
            ApprovalWorkflowPolicy,
            ApprovalStage,
            ExpenseClaim,
            ExpenseItem,
            Reimbursement,
            Notification,
            AuditLog,
          ],
          synchronize: true,
        },
  ),
  // Feature registrations needed for the seeder or services
  TypeOrmModule.forFeature([User, ApprovalWorkflowPolicy]),
];

if (!isOffline) {
  moduleImports.push(
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
    }),
  );
}

@Module({
  imports: moduleImports,
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
