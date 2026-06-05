import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelRequest } from './entities/travel-request.entity';
import { User } from '../users/entities/user.entity';
import { ApprovalWorkflowPolicy } from '../approvals/entities/workflow-policy.entity';
import { ApprovalStage } from '../approvals/entities/approval-stage.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { TravelService } from './travel.service';
import { TravelController } from './travel.controller';
import { NotificationModule } from '../notifications/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TravelRequest,
      User,
      ApprovalWorkflowPolicy,
      ApprovalStage,
      AuditLog,
    ]),
    NotificationModule,
    AuthModule,
  ],
  controllers: [TravelController],
  providers: [TravelService],
  exports: [TravelService],
})
export class TravelModule {}
