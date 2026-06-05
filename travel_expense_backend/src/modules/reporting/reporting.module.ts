import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { ExpenseClaim } from '../expenses/entities/expense-claim.entity';
import { Reimbursement } from '../reimbursements/entities/reimbursement.entity';
import { ApprovalStage } from '../approvals/entities/approval-stage.entity';
import { ReportingService } from './reporting.service';
import { ReportingController } from './reporting.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TravelRequest,
      ExpenseClaim,
      Reimbursement,
      ApprovalStage,
    ]),
    AuthModule,
  ],
  controllers: [ReportingController],
  providers: [ReportingService],
  exports: [ReportingService],
})
export class ReportingModule {}
