import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reimbursement } from './entities/reimbursement.entity';
import { ExpenseClaim } from '../expenses/entities/expense-claim.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { ReimbursementsService } from './reimbursements.service';
import { ReimbursementsController } from './reimbursements.controller';
import { NotificationModule } from '../notifications/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Reimbursement,
      ExpenseClaim,
      TravelRequest,
      User,
      AuditLog,
    ]),
    NotificationModule,
    AuthModule,
  ],
  controllers: [ReimbursementsController],
  providers: [ReimbursementsService],
  exports: [ReimbursementsService],
})
export class ReimbursementsModule {}
