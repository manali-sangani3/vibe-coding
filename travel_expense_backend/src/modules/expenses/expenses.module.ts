import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExpenseClaim } from './entities/expense-claim.entity';
import { ExpenseItem } from './entities/expense-item.entity';
import { TravelRequest } from '../travel/entities/travel-request.entity';
import { User } from '../users/entities/user.entity';
import { AuditLog } from '../audit/entities/audit-log.entity';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';
import { StorageModule } from '../storage/storage.module';
import { NotificationModule } from '../notifications/notification.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ExpenseClaim,
      ExpenseItem,
      TravelRequest,
      User,
      AuditLog,
    ]),
    StorageModule,
    NotificationModule,
    AuthModule,
  ],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
