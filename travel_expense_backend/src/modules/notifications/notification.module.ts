import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';
import { Notification } from './entities/notification.entity';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { NotificationController } from './notification.controller';

const isOffline = process.env.OFFLINE_MODE === 'true';

const moduleImports = [
  TypeOrmModule.forFeature([Notification]),
];

if (!isOffline) {
  moduleImports.push(
    BullModule.registerQueue({
      name: 'notification-queue',
    }),
  );
}

const moduleProviders: any[] = [NotificationService];
if (!isOffline) {
  moduleProviders.push(NotificationProcessor);
}

@Module({
  imports: moduleImports,
  controllers: [NotificationController],
  providers: moduleProviders,
  exports: [NotificationService],
})
export class NotificationModule {}
