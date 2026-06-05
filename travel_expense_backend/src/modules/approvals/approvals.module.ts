import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { ApprovalStage } from './entities/approval-stage.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { ApprovalsService } from './approvals.service';
import { SlaProcessor } from './sla.processor';
import { ApprovalsController } from './approvals.controller';
import { NotificationModule } from '../notifications/notification.module';
import { AuthModule } from '../auth/auth.module';

const isOffline = process.env.OFFLINE_MODE === 'true';

const moduleImports = [
  TypeOrmModule.forFeature([
    ApprovalStage,
    TravelRequest,
    User,
    AuditLog,
  ]),
  NotificationModule,
  AuthModule,
];

if (!isOffline) {
  moduleImports.push(
    BullModule.registerQueue({
      name: 'sla-queue',
    }),
  );
}

const moduleProviders: any[] = [ApprovalsService];
if (!isOffline) {
  moduleProviders.push(SlaProcessor);
}

@Module({
  imports: moduleImports,
  controllers: [ApprovalsController],
  providers: moduleProviders,
  exports: [ApprovalsService, TypeOrmModule],
})
export class ApprovalsModule {}
